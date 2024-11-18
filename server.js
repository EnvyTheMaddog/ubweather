const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'weather_app',
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

// Passport.js setup
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    const query = `SELECT * FROM users WHERE google_id = ?`;
    db.query(query, [profile.id], (err, results) => {
        if (err) return done(err);
        if (results.length === 0) {
            // User doesn't exist, create new record
            const newUser = { email: profile.emails[0].value, google_id: profile.id };
            db.query('INSERT INTO users SET ?', newUser, (err, result) => {
                if (err) return done(err);
                return done(null, newUser);
            });
        } else {
            // User exists
            return done(null, results[0]);
        }
    });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        done(err, results[0]);
    });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

// Home route
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + '/index.html');
    } else {
        res.sendFile(__dirname + '/login.html');
    }
});

// Weather route
app.get('/weather', (req, res) => {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const city = req.query.city || 'London';  // Default city: London

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ error: 'Error fetching weather data' }));
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
