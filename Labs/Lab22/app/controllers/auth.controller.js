import { User } from '../22-02.persistence.js';
import {
  AT_SECRET_KEY,
  generateTokens,
  isTokenInBlacklist,
  putTokenInBlacklist,
  RT_SECRET_KEY,
  updateRefreshToken
} from '../helpers/auth.helper.js';
import pkg from 'lodash';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { AdminRole, UserRole } from '../helpers/user.helper.js';

const { isNil } = pkg;

export class AuthController {

  constructor() {
  }

  loginView(request, response) {
    return response.render('login.hbs');
  }

  async login(request, response) {
    const username = request.body.username;
    const password = request.body.password;

    if (!username || !password) {
      return response.redirect('/auth/login');
    }

    const user = await User.findOne({ where: { name: username } });
    if (!user) {
      return response.redirect('/auth/login');
    }

    const doesPasswordValid = user.password === password;
    if (!doesPasswordValid) {
      return response.redirect('/auth/login');
    }

    await putTokenInBlacklist(user.refreshToken);
    const tokens = generateTokens(user.id, user.name, UserRole);
    await updateRefreshToken(user.id, tokens.refreshToken);

    response.cookie('access-token', tokens.accessToken, {
      httpOnly: true,
      SameSite: 'Strict',
    });
    response.cookie('refresh-token', tokens.refreshToken, {
      httpOnly: true,
      SameSite: 'Strict',
    });

    return response.redirect('/auth/resource');
  }

  signupView(request, response) {
    return response.render('signup.hbs');
  }

  async signup(request, response) {
    const username = request.body.username;
    const password = request.body.password;

    if (!username || !password) {
      return response.redirect('/auth/login');
    }

    const doesUserExist = !isNil(await User.findOne({ where: { name: username } }));
    if (doesUserExist) {
      return response.redirect('/auth/login');
    }

    const user = await User.create({
      name: username,
      password: password,
      role: 'user',
    });

    const tokens = generateTokens(user.id, user.name, UserRole);
    await updateRefreshToken(user.id, tokens.refreshToken);

    response.cookie('access-token', tokens.accessToken, {
      httpOnly: true,
      SameSite: 'Strict',
    });
    response.cookie('refresh-token', tokens.refreshToken, {
      httpOnly: true,
      SameSite: 'Strict',
    });

    return response.redirect('/auth/resource');
  }

  async logout(request, response, next) {
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

    return response.redirect('/auth/login');
  }

  async resource(request, response, next) {
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
  }

  async refreshToken(request, response, next) {
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

    const tokens = generateTokens(user.id, user.name, AdminRole);
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

    return response.redirect('/auth/resource');
  }
}