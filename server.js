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

function resolveRequestPath(urlPath) {
    if (urlPath === '/') {
        return path.join(ROOT_DIR, 'index.html');
    }

    const normalized = path.normalize(decodeURIComponent(urlPath)).replace(/^([.][.][/\\])+/, '');
    return path.join(ROOT_DIR, normalized);
}

function serveFile(filePath, res) {
    fs.stat(filePath, (statErr, stats) => {
        if (statErr || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 - Datei nicht gefunden');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
}

const server = http.createServer((req, res) => {
    const requestPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
    const filePath = resolveRequestPath(requestPath);

    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 - Zugriff verweigert');
        return;
    }

    serveFile(filePath, res);
});

server.listen(PORT, () => {
    console.log('\n🚀 Klartext Medizin Server läuft!');
    console.log(`👉 Klicke hier (Strg+Klick): http://localhost:${PORT}\n`);
});
