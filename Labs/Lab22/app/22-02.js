import express from 'express';
import { initORM, sequelize } from './22-02.persistence.js';
import {
  AT_SECRET_KEY,
  SECRET_KEY,
} from './helpers/auth.helper.js';
import cookieParser from 'cookie-parser';
import { redisClient } from './helpers/redis.helper.js';
import { authRouter } from './routers/auth.router.js';
import { usersRouter } from './routers/users.router.js';
import { reposRouter } from './routers/repos.router.js';
import { commitsRouter } from './routers/commits.router.js';
import { defineAbilitiesForUser } from './helpers/casl.helper.js';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3003;

app.set('views', 'app/views');
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(SECRET_KEY));

app.use(async (request, response, next) => {
  const accessToken = request.cookies['access-token'];
  const jwtPayload = await jwt.verify(accessToken, AT_SECRET_KEY, (error, decoded) => {
    if (error) {
      return null;
    }
    return decoded;
  });
  request.currentUser = jwtPayload;
  request.ability = defineAbilitiesForUser(jwtPayload);
  next();
});

app.use('/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/repositories', commitsRouter);
app.use('/api/repositories', reposRouter);

app.use((request, response, next) => {
  response.status(404).send('<h1>Not found</h1>');
});

app.use((error, request, response, next) => {
  response?.status(error?.status);
  response?.render('error.hbs', {
    message: error?.message,
  });
});

(async function appStart() {
  await sequelize.authenticate();
  console.log('Connected to DB successfully');
  await initORM();

  await redisClient.connect();
  console.log('Connected to redis successfully');

  app.listen(PORT, () => {
    console.log(`Server has been started on port ${ PORT }`);
  });
})();


