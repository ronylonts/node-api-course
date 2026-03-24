const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.message}`);

  const statusCode = err.status || 500;
  
  const response = {
    message: env.NODE_ENV === 'production' && statusCode === 500 
      ? "Erreur interne du serveur" 
      : err.message
  };

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;