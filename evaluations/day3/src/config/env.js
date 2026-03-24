require('dotenv').config();

const env = {
  PORT: process.env.PORT || 3005,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_unsecure',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_unsecure',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3005'
};

module.exports = env;