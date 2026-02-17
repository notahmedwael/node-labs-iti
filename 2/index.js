import http from 'http';
import { renderHomePage, addItemToList } from './productController.js';
import { serveFile } from './fileHandler.js';


const server = http.createServer((req, res) => {
    const url = req.url;

    if (url === '/' && req.method === 'GET') {
        renderHomePage(res);

    }else if (req.url === '/inventory' && req.method === 'POST') {
        addItemToList(req, res);
    }
    else if (url === '/astronomy'){
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(`
            <html>
                <head><title>Inventory Management</title><link rel="stylesheet" href="/style.css"></head>
                <body>
                    <h1>Astronomy Page</h1>
                    <img src="/astronomyServe" width="500">
                    <p>Exploring the vast wonders of the cosmos and the stars above.</p>
                </body>
            </html>
            `)
    } else if (url === '/serbal'){
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(`
            <html>
                <head><title>Inventory Management</title><link rel="stylesheet" href="/style.css"></head>
                <body>
                    <h1>Serbal Page</h1>
                    <img src="/serbalServe" width="500">
                    <p>Exploring the beauty and wonders of the mountains.</p>
                </body>
            </html>
            `)
    }
    else if (url === '/style.css') {
        serveFile('./style.css', 'text/css', res);
    }
    else if (url === '/astronomyServe') {
        serveFile('./astronomy.jpg', 'image/jpeg', res);
    }
    else if (url === '/serbalServe') {
        serveFile('./serbal.jpeg', 'image/jpeg', res);
    }
    else {
        res.writeHead(404);
        res.end(`
            <html>
                <head><title>Inventory Management</title><link rel="stylesheet" href="/style.css"></head>
                <body>
                    <h1>Error 404: Not Found</h1>
                </body>
            </html>
            `)
    }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));