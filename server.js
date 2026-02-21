/*
 * Klartext Medizin - Backend Server (Open Access Edition)
 */

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const argon2 = require('argon2');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('./database.sqlite');

app.use(express.json());

// ==========================================
// 🔒 Session-Management
// ==========================================
app.use(session({
    secret: 'KlartextMedizin_Super_Secret_Key_2026!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 1000 * 60 * 60 * 8
    }
}));

// ==========================================
// 🧑 ROUTE: Wer bin ich? (Profil-Check)
// ==========================================
app.get('/api/me', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// ==========================================
// 🔑 ROUTE: Login
// ==========================================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Datenbankfehler' });
        if (!user) return res.status(401).json({ error: 'Falsche Zugangsdaten' });

        try {
            const isMatch = await argon2.verify(user.password_hash, password);
            if (isMatch) {
                req.session.userId = user.id;
                req.session.username = user.username;
                
                // WICHTIG: Session zwingend speichern, bevor wir antworten!
                req.session.save(() => {
                    res.json({ success: true, message: 'Login erfolgreich!' });
                });
            } else {
                res.status(401).json({ error: 'Falsche Zugangsdaten' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Kryptographie-Fehler beim Login' });
        }
    });
});

// ==========================================
// 📝 ROUTE: Registrierung
// ==========================================
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || password.length < 6) {
        return res.status(400).json({ error: 'Benutzername & Passwort (min. 6 Zeichen) erforderlich.' });
    }

    db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
        if (err) return res.status(500).json({ error: 'Datenbankfehler' });
        if (row) return res.status(400).json({ error: 'Dieser Benutzername ist bereits vergeben.' });

        try {
            const hash = await argon2.hash(password);
            
            db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash], function(err) {
                if (err) return res.status(500).json({ error: 'Fehler beim Anlegen des Benutzers.' });
                
                req.session.userId = this.lastID;
                req.session.username = username;
                
                // WICHTIG: Session zwingend speichern, bevor wir antworten!
                req.session.save(() => {
                    res.json({ success: true, message: 'Registrierung erfolgreich!' });
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Kryptographie-Fehler bei Registrierung' });
        }
    });
});

// ==========================================
// 🚪 ROUTE: Logout (Echtes Abmelden)
// ==========================================
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        res.clearCookie('connect.sid'); 
        res.json({ success: true });
    });
});

// ==========================================
// 📦 ROUTE: WBT-Daten (Für alle offen!)
// ==========================================
app.get('/api/wbts', (req, res) => {
    db.all('SELECT * FROM wbts', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Datenbankfehler' });
        
        const formattedRows = rows.map(row => ({
            ...row,
            tags: JSON.parse(row.tags),
            featured: row.featured === 1
        }));
        res.json(formattedRows);
    });
});

// ==========================================
// 🌐 STATISCHE DATEIEN (BARRIEREFREI)
// ==========================================
// Das hier fixt den Startseiten-Error. Der Server liefert alle HTML/JS/CSS-Dateien 
// völlig automatisch genau so aus, wie sie im Ordner liegen. Keine fehlenden Pfade mehr!
app.use(express.static(__dirname));


// Server starten
app.listen(PORT, () => {
    console.log(`\n🔓 Klartext Medizin (Open Access Edition) läuft!`);
    console.log(`👉 Klicke hier (Strg+Klick): http://localhost:${PORT}\n`);
});