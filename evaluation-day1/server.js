const http = require('http');
const router = require('./modules/router');

const PORT = 3005;
const server = http.createServer(async (req, res) => {
    const timestamp = new Date().toISOString();
    res.on('finish', () => {
        console.log(`[${timestamp}] ${req.method} ${req.url} → ${res.statusCode}`);
    });

    await router(req, res);
});

server.listen(PORT, () => {
    console.log(`LibraryAPI démarrée sur http://localhost:${PORT}`);
});