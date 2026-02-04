const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    let filePath = '.' + req.url;
    
    // Handle root: show loading page first, then user is redirected to index
    if (filePath === './') {
        filePath = './loading.html';
    } else if (filePath === './public' || filePath === './public/') {
        filePath = './public/pages/index.html';
    }

    // Check if path is a directory
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 - الملف غير موجود</h1>', 'utf-8');
            return;
        }

        // If it's a directory, serve index.html
        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('<h1>404 - الملف غير موجود</h1>', 'utf-8');
                } else if (error.code === 'EISDIR') {
                    // Try to serve index.html from directory
                    const indexPath = path.join(filePath, 'index.html');
                    fs.readFile(indexPath, (err2, content2) => {
                        if (err2) {
                            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.end('<h1>404 - الملف غير موجود</h1>', 'utf-8');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.end(content2, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('<h1>خطأ في الخادم: ' + error.code + '</h1>', 'utf-8');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log('🚀 الخادم يعمل على: http://localhost:' + PORT);
    console.log('📱 افتح: http://localhost:' + PORT);
    console.log('');
    console.log('الصفحات المتاحة:');
    console.log('  - http://localhost:' + PORT + ' (الصفحة الرئيسية)');
    console.log('  - http://localhost:' + PORT + '/public/pages/login.html');
    console.log('  - http://localhost:' + PORT + '/public/pages/dashboard.html');
    console.log('  - http://localhost:' + PORT + '/public/pages/profile.html');
    console.log('  - http://localhost:' + PORT + '/public/pages/videos.html');
    console.log('  - http://localhost:' + PORT + '/public/pages/exams.html');
    console.log('  - http://localhost:' + PORT + '/public/pages/notes.html');
});
