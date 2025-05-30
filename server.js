const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('./exam.db');

// Create tables (if they don't exist)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            duration INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER,
            question_text TEXT NOT NULL,
            option_a TEXT,
            option_b TEXT,
            option_c TEXT,
            option_d TEXT,
            correct_answer TEXT,
            FOREIGN KEY (exam_id) REFERENCES exams(id)
        )
    `);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// API Routes
app.get('/api/exams', (req, res) => {
    db.all('SELECT * FROM exams', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/exams', (req, res) => {
    const { title, description, duration } = req.body;
    db.run(
        'INSERT INTO exams (title, description, duration) VALUES (?, ?, ?)',
        [title, description, duration],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
