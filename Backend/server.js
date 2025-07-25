const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3088;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON bodies

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'postgres',
  database: 'notifications',
  password: 'admin123', // Replace with your PostgreSQL password
  port: 5432,
});

// Connect to PostgreSQL
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
    return;
  }
  console.log('Connected to PostgreSQL database');
});

// Create notifications table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Error creating notifications table:', err.stack);
  } else {
    console.log('Notifications table ready');
  }
});

// API Routes

// Get all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notifications:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new notification
app.post('/api/notifications', async (req, res) => {
  const { title, message, icon, date, time } = req.body;
  if (!title || !message || !icon || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO notifications (title, message, icon, date, time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, message, icon, date, time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating notification:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://16.171.159.19:${port}`);
});