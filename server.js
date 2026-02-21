/*
 * Klartext Medizin - Backend Server
 */

const express = require('express');
const path = require('path');

// 1. Server-Instanz erstellen
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middleware für statische Dateien
// Sagt dem Server: Liefere alle Frontend-Dateien (HTML, CSS, JS, Bilder) aus diesem Ordner aus.
app.use(express.static(__dirname));

// 3. Fallback Route (Startseite)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Server starten
app.listen(PORT, () => {
    console.log(`\n🚀 Klartext Medizin Server läuft!`);
    console.log(`👉 Klicke hier (Strg+Klick): http://localhost:${PORT}\n`);
});