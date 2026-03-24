const app = require('./src/app');
const env = require('./src/config/env');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/docs/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});