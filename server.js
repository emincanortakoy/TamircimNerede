const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Static files
app.use(express.static(path.join(__dirname)));

// Initialize better-sqlite3 database
const db = new Database('./database.sqlite', { verbose: console.log });
console.log('Connected to the SQLite database using better-sqlite3.');

// Create tables for the key-value store approach to minimize structural changes
db.exec(`CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT
)`);

// Initialize empty arrays if not exist
const insertOrIgnore = db.prepare(`INSERT OR IGNORE INTO store (key, value) VALUES (?, ?)`);
insertOrIgnore.run('isletmeler', '[]');
insertOrIgnore.run('kullanicilar', '[]');

// GET endpoint
app.get('/api/store/:key', (req, res) => {
    const key = req.params.key;
    try {
        const stmt = db.prepare(`SELECT value FROM store WHERE key = ?`);
        const row = stmt.get(key);
        if (row) {
            res.send(row.value);
        } else {
            res.send('[]');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST endpoint
app.post('/api/store/:key', (req, res) => {
    const key = req.params.key;
    const value = JSON.stringify(req.body);
    
    try {
        const stmt = db.prepare(`INSERT INTO store (key, value) VALUES (?, ?)
                                 ON CONFLICT(key) DO UPDATE SET value = ?`);
        stmt.run(key, value, value);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
