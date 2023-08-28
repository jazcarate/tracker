const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 9000;

http.createServer(function (req, res) {
    const parsedUrl = url.parse(req.url);
    let pathname = `docs${parsedUrl.pathname}`;
    const ext = path.parse(pathname).ext || ".html";
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
    };

    fs.stat(pathname, function (err, stat) {
        if (err) {
            res.statusCode = 404;
            res.end(`File ${pathname} not found! ${err.message}`);
            return;
        }

        if (stat.isDirectory()) pathname += '/index' + ext;

        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', map[ext] || 'text/plain');
                res.setHeader('Permissions-Policy', 'gyroscope self, magnetometer self, accelerometer self');
                res.end(data);
            }
        });
    });


}).listen(parseInt(port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});