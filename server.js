const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Set up the MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: '12345678',  // Your MySQL password
    database: 'weather_app'  // Your database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

// Define your routes for user authentication and other API endpoints here

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
