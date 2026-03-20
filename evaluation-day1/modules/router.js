const { readDB, writeDB } = require('./db');

async function router(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;
    const path = url.pathname;
    res.setHeader('Content-Type', 'application/json');

    try {
        if (method === 'GET' && path === '/books') {
            const db = await readDB();
            let books = db.books;
            const availableParam = url.searchParams.get('available');
            if (availableParam === 'true') {
                books = books.filter(b => b.available === true);
            }

            res.statusCode = 200;
            return res.end(JSON.stringify({
                success: true,
                count: books.length,
                data: books
            }));
        }
        if (method === 'GET' && path.startsWith('/books/')) {
            const id = parseInt(path.split('/')[2]);
            const db = await readDB();
            const book = db.books.find(b => b.id === id);

            if (!book) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ success: false, error: "Livre introuvable" }));
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, data: book }));
        }
        if (method === 'POST' && path === '/books') {
            let body = '';
            for await (const chunk of req) { body += chunk; }

            let data;
            try { data = JSON.parse(body); } 
            catch (e) { res.statusCode = 400; return res.end(JSON.stringify({ success: false, error: "JSON mal formé" })); }

            const { title, author, year } = data;
            if (!title || !author || !year) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ success: false, error: "Les champs title, author et year sont requis" }));
            }

            const db = await readDB();
            const newBook = {
                id: db.books.length > 0 ? Math.max(...db.books.map(b => b.id)) + 1 : 1,
                title, author, year, available: true
            };

            db.books.push(newBook);
            await writeDB(db);
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, data: newBook }));
        }
        if (method === 'DELETE' && path.startsWith('/books/')) {
            const id = parseInt(path.split('/')[2]);
            const db = await readDB();
            const index = db.books.findIndex(b => b.id === id);

            if (index === -1) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ success: false, error: "Livre introuvable" }));
            }

            db.books.splice(index, 1);  
            await writeDB(db);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, message: "Livre supprimé avec succès" }));
        }

        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: "Route non trouvée" }));

    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: "Erreur interne" }));
    }
}

module.exports = router;