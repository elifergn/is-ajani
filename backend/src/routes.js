const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { sendApplicationEmail } = require('./mailer');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_is_ajani_key';

// Multer & Dosya Yükleme Yapılandırması
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads', 'cv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Register
router.post('/auth/register', async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;
    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ error: 'Fullname, email, username and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (fullname, email, username, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email',
      [fullname, email, username, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT' || error.message?.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, telegram_chat_id: user.telegram_chat_id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Get jobs by category
router.get('/jobs', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM jobs ORDER BY created_at DESC';
    let params = [];
    if (category) {
      query = 'SELECT * FROM jobs WHERE category = $1 ORDER BY created_at DESC';
      params = [category];
    }
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Subscribe to a category
router.post('/subscriptions', authenticate, async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ error: 'Category required' });

    await db.query(
      'INSERT INTO subscriptions (user_id, category) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, category]
    );
    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user subscriptions
router.get('/subscriptions', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT category FROM subscriptions WHERE user_id = $1', [req.user.id]);
    res.json(result.rows.map(row => row.category));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create job (For testing notifications)
router.post('/jobs', authenticate, async (req, res) => {
  try {
    const { title, company, category, description } = req.body;
    const result = await db.query(
      'INSERT INTO jobs (title, company, category, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, company, category, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply to a job
router.post('/jobs/:id/apply', authenticate, async (req, res) => {
  try {
    const jobId = req.params.id;
    // Check if job exists
    const jobCheck = await db.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get user details for mail sending
    const userCheck = await db.query('SELECT fullname, email FROM users WHERE id = $1', [req.user.id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const job = jobCheck.rows[0];
    const user = userCheck.rows[0];

    await db.query(
      'INSERT INTO applications (user_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, jobId]
    );

    // Send confirmation email asynchronously (do not block client response)
    sendApplicationEmail(user.email, user.fullname, job.title, job.company);

    res.json({ message: 'Applied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user applications
router.get('/applications', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT jobs.*, applications.created_at as applied_at 
      FROM applications 
      JOIN jobs ON applications.job_id = jobs.id 
      WHERE applications.user_id = $1 
      ORDER BY applications.created_at DESC
    `;
    const result = await db.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile info
router.get('/user/profile', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, fullname, email, username, telegram_chat_id, phone, city, university, department, skills, cv_path FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Custom middleware to handle Multer upload errors
const handleCvUpload = (req, res, next) => {
  upload.single('cv')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `CV yükleme hatası: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Update user profile info
router.put('/user/profile', authenticate, handleCvUpload, async (req, res) => {
  try {
    const { phone, city, university, department, skills } = req.body;
    let cv_path = null;
    if (req.file) {
      cv_path = `/uploads/cv/${req.file.filename}`;
    }

    let updateQuery;
    let params;

    if (cv_path) {
      updateQuery = `
        UPDATE users 
        SET phone = $1, city = $2, university = $3, department = $4, skills = $5, cv_path = $6
        WHERE id = $7
      `;
      params = [phone, city, university, department, skills, cv_path, req.user.id];
    } else {
      updateQuery = `
        UPDATE users 
        SET phone = $1, city = $2, university = $3, department = $4, skills = $5
        WHERE id = $6
      `;
      params = [phone, city, university, department, skills, req.user.id];
    }

    await db.query(updateQuery, params);

    // Fetch and return updated profile
    const updatedUserRes = await db.query(
      'SELECT id, fullname, email, username, telegram_chat_id, phone, city, university, department, skills, cv_path FROM users WHERE id = $1',
      [req.user.id]
    );
    
    res.json({ 
      message: 'Profil başarıyla güncellendi.', 
      user: updatedUserRes.rows[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
});

module.exports = router;
