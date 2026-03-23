const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});