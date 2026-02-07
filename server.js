require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;

// Rate limiting storage
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000; // 15 min
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
        if (now - data.resetTime > RATE_LIMIT_WINDOW) {
            rateLimitMap.delete(ip);
        }
    }
}, 300000);

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
    // Get client IP
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Rate limiting check
    const now = Date.now();
    if (!rateLimitMap.has(clientIP)) {
        rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
        const rateData = rateLimitMap.get(clientIP);
        if (now > rateData.resetTime) {
            rateData.count = 1;
            rateData.resetTime = now + RATE_LIMIT_WINDOW;
        } else {
            rateData.count++;
            if (rateData.count > RATE_LIMIT_MAX) {
                res.writeHead(429, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>429 - تم تجاوز الحد المسموح من الطلبات</h1><p>يرجى المحاولة لاحقاً</p>', 'utf-8');
                return;
            }
        }
    }
    
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
