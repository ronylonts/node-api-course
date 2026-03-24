const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Bibliotheque',
      version: '1.0.0',
      description: 'Documentation Jour 3 - Securite avancee',
    },
    servers: [
      {
        url: 'http://localhost:3005',
        description: 'Serveur local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Livre: {
          type: 'object',
          properties: {
            id:         { type: 'integer', example: 1 },
            titre:      { type: 'string',  example: 'Le Petit Prince' },
            auteur:     { type: 'string',  example: 'Antoine de Saint-Exupery' },
            isbn:       { type: 'string',  example: '978-2070612758' },
            disponible: { type: 'boolean', example: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Erreur interne' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

let swaggerSpec;
try {
  swaggerSpec = swaggerJsdoc(options);
} catch (e) {
  console.error('Swagger generation error:', e.message);
  swaggerSpec = {
    openapi: '3.0.3',
    info: { title: 'API Bibliotheque', version: '1.0.0' },
    paths: {},
  };
}

function setupSwagger(app) {
  app.get('/api-docs/swagger.json', (req, res) => {
    res.json(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;