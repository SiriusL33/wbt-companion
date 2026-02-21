/*
 * Klartext Medizin - Backend Server (Enterprise Security Edition)
 */

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const argon2 = require('argon2');

// 1. Server & DB Instanz
const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('./database.sqlite');

// 2. Body Parser (Damit der Server die Login-Daten aus dem Formular lesen kann)
app.use(express.json());

// ==========================================
// 🔒 SECURITY: Hochsicheres Session-Management
// ==========================================
app.use(session({
    secret: 'KlartextMedizin_Super_Secret_Key_2026!', // In Produktion: als ENV-Variable!
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,  // JavaScript kommt nicht an das Cookie (Schutz vor XSS)
        secure: false,   // Später auf dem Server (bei HTTPS) auf 'true' setzen!
        maxAge: 1000 * 60 * 60 * 8 // Session verfällt nach 8 Stunden
    }
}));

// ==========================================
// 🛡️ SECURITY: Die Auth-Middleware (URL-Hardening)
// ==========================================
const checkAuth = (req, res, next) => {
    // Hat der User ein gültiges Ticket (Session)?
    if (req.session && req.session.userId) {
        next(); // Türsteher winkt durch!
    } else {
        res.status(401).json({ error: 'Zugriff verweigert. URL-Hardening aktiv.' });
    }
};

// ==========================================
// 🔑 ROUTE: Der Login-Endpunkt
// ==========================================
// ==========================================
// 📝 ROUTE: Registrierung (Neu)
// ==========================================
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // 1. Validierung
    if (!username || !password || password.length < 6) {
        return res.status(400).json({ error: 'Benutzername & Passwort (min. 6 Zeichen) erforderlich.' });
    }

    try {
        // 2. Prüfen, ob der Name schon existiert
        db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) return res.status(500).json({ error: 'Datenbankfehler' });
            if (row) return res.status(400).json({ error: 'Dieser Benutzername ist bereits vergeben.' });

            // 3. Argon2 Hashing
            const hash = await argon2.hash(password);

            // 4. Nutzer in die Datenbank schreiben
            db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash], function(err) {
                if (err) return res.status(500).json({ error: 'Fehler beim Anlegen des Benutzers.' });
                
                // 5. Seamless UX: Direkt einloggen nach Registrierung!
                req.session.userId = this.lastID; // this.lastID ist die neue ID des Users
                req.session.username = username;
                res.json({ success: true, message: 'Registrierung erfolgreich!' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kryptographie-Fehler bei Registrierung' });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Datenbankfehler' });
        
        // Wenn der User gar nicht existiert
        if (!user) return res.status(401).json({ error: 'Falsche Zugangsdaten' });

        try {
            // Memory-Hardness im Einsatz: Argon2 prüft das Passwort gegen den Hash
            const isMatch = await argon2.verify(user.password_hash, password);
            
            if (isMatch) {
                // Login erfolgreich! Wir stellen das fälschungssichere Session-Ticket aus.
                req.session.userId = user.id;
                req.session.username = user.username;
                res.json({ success: true, message: 'Login erfolgreich!' });
            } else {
                res.status(401).json({ error: 'Falsche Zugangsdaten' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Kryptographie-Fehler beim Login' });
        }
    });
});

// ==========================================
// 📦 ROUTE: WBT-Daten (JETZT GESCHÜTZT!)
// ==========================================
// Beachte das "checkAuth" in der Mitte. Ohne Session kommt hier niemand mehr durch.
app.get('/api/wbts', checkAuth, (req, res) => {
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
// 🌐 STATISCHE DATEIEN
// ==========================================
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🔒 Klartext Medizin (Secure Edition) läuft!`);
    console.log(`👉 Klicke hier (Strg+Klick): http://localhost:${PORT}\n`);
});