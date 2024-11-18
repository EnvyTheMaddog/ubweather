const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password', // Replace with your actual MySQL password
  database: 'weather_app',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Sign-Up Route: Hash password and store in database
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).send('Error checking email');
      }

      if (result.length > 0) {
        return res.status(400).send('Email already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Store in database
      db.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('Error saving user to database:', err);
            return res.status(500).send('Error signing up');
          }
          res.status(201).send('User signed up successfully');
        }
      );
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error hashing password');
  }
});

// Log-In Route: Check if email exists and compare passwords
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Error fetching user from database:', err);
      return res.status(500).send('Error logging in');
    }

    if (result.length === 0) {
      return res.status(400).send('User not found');
    }

    // Compare hashed password with the one in the database
    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    res.status(200).send('User logged in successfully');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
