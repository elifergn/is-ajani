require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
