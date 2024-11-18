<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace 'root' if you have a different username
  password: '12345678', // Replace with your MySQL password
  database: 'weather_app', // Ensure this matches your database name
});


db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Sign-Up Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).send('Error checking email');
    if (result.length > 0) return res.status(400).send('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).send('Error signing up');
        res.status(201).send('User signed up successfully');
      }
    );
  });
});

// Log-In Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).send('Error fetching user');
    if (result.length === 0) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    res.status(200).send('User logged in successfully');
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
=======
const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Set up middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '12345678', // Replace with your MySQL password
  database: 'weather_app' // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Google Sign-In (use the data from Google Sign-In to authenticate)
app.post('/google-signin', (req, res) => {
  const { email, name, picture } = req.body;

  // You can store Google profile info in the database if necessary
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Error fetching user');
      }

      if (result.length === 0) {
        // If no user exists, create a new record
        db.query(
          'INSERT INTO users (email, name, picture) VALUES (?, ?, ?)',
          [email, name, picture],
          (err, result) => {
            if (err) {
              console.error('Error inserting new user:', err);
              return res.status(500).send('Error inserting new user');
            }
            return res.status(201).send('User signed up successfully');
          }
        );
      } else {
        // User exists
        return res.status(200).send('User authenticated successfully');
      }
    }
  );
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

// Login Route: Verify email and password
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verify if the email exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).send('Error checking email');
    }

    if (result.length === 0) {
      return res.status(400).send('Email not found');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, result[0].password);
    if (isMatch) {
      res.status(200).send('Login successful');
    } else {
      res.status(400).send('Incorrect password');
    }
  });
});

// Weather Route: Get weather data for Ulaanbaatar
app.get('/weather', async (req, res) => {
  const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your OpenWeather API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Ulaanbaatar&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(500).send('Error fetching weather data');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Error fetching weather data');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
>>>>>>> e00e5c527f501d291ad9a60ec0ddf8369baed75d
