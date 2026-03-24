const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/livres');
const errorHandler = require('./middlewares/errorHandler');
const setupSwagger = require('./docs/swagger');

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  credentials: true
}));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/livres', bookRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Bibliotheque - Jour 3 Securisee' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvee' });
});

app.use(errorHandler);

module.exports = app;