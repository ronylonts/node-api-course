const express = require('express');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/livres', bookRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API Bibliothèque - Jour 2" });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message === 'NOT_AVAILABLE') {
        return res.status(409).json({ message: "Le livre n'est pas disponible." });
    }
    if (err.message === 'AUTH_FAILED' || err.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ message: "Identifiants incorrects." });
    }

    res.status(err.status || 500).json({
        message: err.message || "Une erreur interne est survenue sur le serveur."
    });
});

module.exports = app;