/*
 * Klartext Medizin - Backend Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

function safeDecodePath(urlPath) {
    try {
        return decodeURIComponent(urlPath);
    } catch {
        return null;
    }
}

function resolveRequestPath(urlPath) {
    if (urlPath === '/') {
        return path.join(ROOT_DIR, 'index.html');
    }

    const decoded = safeDecodePath(urlPath);
    if (!decoded) {
        return null;
    }

    const normalized = path.normalize(decoded).replace(/^([.][.][/\\])+/, '');
    const absolutePath = path.join(ROOT_DIR, normalized);

    if (!absolutePath.startsWith(ROOT_DIR)) {
        return null;
    }

    return absolutePath;
}

function sendText(res, status, message) {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
}

function serveFile(filePath, res) {
    fs.stat(filePath, (statErr, stats) => {
        if (statErr || !stats.isFile()) {
            sendText(res, 404, '404 - Datei nicht gefunden');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
        });

        const stream = fs.createReadStream(filePath);
        stream.on('error', () => sendText(res, 500, '500 - Interner Serverfehler'));
        stream.pipe(res);
    });
}

const server = http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
        sendText(res, 405, '405 - Methode nicht erlaubt');
        return;
    }

    const requestPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
    const filePath = resolveRequestPath(requestPath);

    if (!filePath) {
        sendText(res, 400, '400 - Ungültiger Pfad');
        return;
    }

    serveFile(filePath, res);
});

server.listen(PORT, () => {
    console.log('\n🚀 Klartext Medizin Server läuft!');
    console.log(`👉 Klicke hier (Strg+Klick): http://localhost:${PORT}\n`);
});
