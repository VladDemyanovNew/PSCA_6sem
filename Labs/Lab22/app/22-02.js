import express from 'express';
import { initORM, sequelize, User } from './db.js';
import {
  AT_SECRET_KEY,
  generateTokens, isTokenInBlacklist,
  putTokenInBlacklist,
  RT_SECRET_KEY,
  SECRET_KEY,
  updateRefreshToken
} from './auth.helper.js';
import jwt from 'jsonwebtoken';
import pkg from 'lodash';
import cookieParser from 'cookie-parser';
import { redisClient } from './redis.helper.js';
import createError from 'http-errors';

const { isNil } = pkg;
const app = express();
const PORT = 3003;

app.set('views', 'app/views');
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(SECRET_KEY));

app.get('/login', (request, response) => {
  return response.render('login.hbs');
});

app.get('/signup', (request, response) => {
  return response.render('signup.hbs');
});

app.post('/signup', async (request, response, next) => {
  const username = request.body.username;
  const password = request.body.password;

  if (!username || !password) {
    return response.redirect('/login');
  }

  const doesUserExist = !isNil(await User.findOne({ where: { name: username } }));
  if (doesUserExist) {
    return response.redirect('/login');
  }

  const user = await User.create({
    name: username,
    password: password,
  });

  const tokens = generateTokens(user.id, user.name);
  await updateRefreshToken(user.id, tokens.refreshToken);

  response.cookie('access-token', tokens.accessToken, {
    httpOnly: true,
    SameSite: 'Strict',
  });
  response.cookie('refresh-token', tokens.refreshToken, {
    httpOnly: true,
    SameSite: 'Strict',
  });

  return response.redirect('/resource');
});

app.post(
  '/login',
  async (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if (!username || !password) {
      return response.redirect('/login');
    }

    const user = await User.findOne({ where: { name: username } });
    if (!user) {
      return response.redirect('/login');
    }

    const doesPasswordValid = user.password === password;
    if (!doesPasswordValid) {
      return response.redirect('/login');
    }

    await putTokenInBlacklist(user.refreshToken);
    const tokens = generateTokens(user.id, user.name);
    await updateRefreshToken(user.id, tokens.refreshToken);

    response.cookie('access-token', tokens.accessToken, {
      httpOnly: true,
      SameSite: 'Strict',
    });
    response.cookie('refresh-token', tokens.refreshToken, {
      httpOnly: true,
      SameSite: 'Strict',
    });

    return response.redirect('/resource');
  },
);

app.get('/logout', async (request, response, next) => {
  const accessToken = request.cookies['access-token'];
  const payload = jwt.verify(accessToken, AT_SECRET_KEY, (error, decoded) => {
    if (error) {
      return createError(401, error.message);
    }
    return decoded;
  });
  if (payload instanceof Error) {
    return next(payload);
  }

  const user = await User.findByPk(payload.id);
  if (!user) {
    return next(createError(400, `User with id=${ payload.id } does not exist`));
  }

  await putTokenInBlacklist(user.refreshToken);
  await updateRefreshToken(user.id, null);

  response.clearCookie('access-token');
  response.clearCookie('refresh-token');

  return response.redirect('/login');
});

app.get('/resource', async (request, response, next) => {
    const accessToken = request.cookies['access-token'];
    const payload = jwt.verify(accessToken, AT_SECRET_KEY, (error, decoded) => {
      if (error) {
        return createError(401, error.message);
      }
      return decoded;
    });

    if (payload instanceof Error) {
      return next(payload);
    }

    return response.end('resource');
  },
);

app.get('/refresh-token', async (request, response, next) => {
  const refreshToken = request.cookies['refresh-token'];
  const payload = jwt.verify(refreshToken, RT_SECRET_KEY, (error, decoded) => {
    if (error) {
      return createError(401, error.message);
    }
    return decoded;
  });
  if (payload instanceof Error) {
    return next(payload);
  }

  const user = await User.findByPk(payload.id);
  if (!user) {
    return next(createError(400, `User with id=${ payload.id } does not exist`));
  }
  if (!user.refreshToken || await isTokenInBlacklist(refreshToken)) {
    return next(createError(401, 'Refresh token is in blacklist'));
  }

  const tokens = generateTokens(user.id, user.name);
  await putTokenInBlacklist(user.refreshToken);
  await updateRefreshToken(user.id, tokens.refreshToken);

  response.cookie('access-token', tokens.accessToken, {
    httpOnly: true,
    SameSite: 'Strict',
  });
  response.cookie('refresh-token', tokens.refreshToken, {
    httpOnly: true,
    SameSite: 'Strict',
  });

  return response.redirect('/resource');
});

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


