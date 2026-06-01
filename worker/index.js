const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite veritabanı dosya yolu (ortak Docker volume veya lokal)
const dbPath = process.env.DATABASE_FILE || path.join(__dirname, '..', 'backend', 'is_ajani.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Worker veritabanı bağlantı hatası:', err);
  } else {
    console.log('Worker SQLite veritabanına bağlandı:', dbPath);
  }
});

// Promisified query wrapper ($1, $2, ... parametrelerini ? parametrelerine çevirir)
const query = (sql, params = []) => {
  const sqliteSql = sql.replace(/\$\d+/g, '?');
  return new Promise((resolve, reject) => {
    db.all(sqliteSql, params, (err, rows) => {
      if (err) reject(err);
      else resolve({ rows });
    });
  });
};

const checkForNewJobs = async () => {
  try {
    // notified = 0 (false) olan iş ilanlarını tara
    const res = await query('SELECT * FROM jobs WHERE notified = 0 OR notified = false');
    const jobs = res.rows;

    for (const job of jobs) {
      console.log(`Yeni iş ilanı işleniyor: ${job.title} - Sektör: ${job.category}`);
      // İlanı bildirildi (notified = 1) olarak işaretle
      await query('UPDATE jobs SET notified = 1 WHERE id = $1', [job.id]);
    }
  } catch (error) {
    console.error('Yeni iş ilanları taranırken hata oluştu:', error);
  }
};

// Her 10 saniyede bir yeni ilanları denetle
setInterval(checkForNewJobs, 10000);
console.log('Worker başlatıldı. Her 10 saniyede bir yeni ilanlar taranacak ve işlenecek...');
