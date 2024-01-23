const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const getContentType = (filePath) => {
    const ext = path.extname(filePath);
    switch (ext) {
        case '.html':
            return 'text/html';
        case '.js':
            return 'text/javascript';
        case '.png':
            return 'image/png';
        case '.css':
            return 'text/css';
        default:
            return 'text/plain';
    }
};

const server = http.createServer((req, res) => {
    let filePath;
    if (req.url === '/') {
        filePath = path.join(__dirname, 'web', 'index.html');
    } else {
        filePath = path.join(__dirname, req.url);
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(err.code === 'ENOENT' ? 404 : 500);
            res.end(err.code === 'ENOENT' ? 'Not found' : 'Error loading file');
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            res.end(data);
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    exec(`start http://localhost:${port}`);
});