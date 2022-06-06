import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const app = express();
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(3000, () => console.log('Server has been started'));