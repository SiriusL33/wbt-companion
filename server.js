/*
 * Klartext Medizin - Backend Server
 */

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 1. Server-Instanz erstellen
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Datenbankverbindung herstellen
const db = new sqlite3.Database('./database.sqlite');

// 3. Middleware für statische Dateien
app.use(express.static(__dirname));

// ==========================================
// 4. NEU: Unsere API-Schnittstelle
// ==========================================
app.get('/api/wbts', (req, res) => {
    // Wir holen alle Kurse aus der Tabelle "wbts"
    db.all('SELECT * FROM wbts', [], (err, rows) => {
        if (err) {
            console.error("Fehler bei der Datenbankabfrage:", err);
            res.status(500).json({ error: 'Datenbankfehler' });
            return;
        }
        
        // Da SQLite keine Arrays kennt (wir haben die Tags als Text gespeichert) 
        // und Booleans als 0/1 speichert, formatieren wir das für das Frontend kurz um.
        const formattedRows = rows.map(row => ({
            ...row,
            tags: JSON.parse(row.tags),
            featured: row.featured === 1
        }));
        
        // Wir schicken die fertigen Daten als JSON ans Frontend!
        res.json(formattedRows);
    });
});

// 5. Fallback Route (Startseite)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 6. Server starten
app.listen(PORT, () => {
    console.log(`\n🚀 Klartext Medizin Server läuft!`);
    console.log(`👉 Klicke hier (Strg+Klick): http://localhost:${PORT}\n`);
});