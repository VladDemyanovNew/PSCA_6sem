import jwt from 'jsonwebtoken';
import { User } from '../22-02.persistence.js';
import { redisClient } from './redis.helper.js';
import pkg from 'lodash';

const { isNil } = pkg;

export const AT_SECRET_KEY = 'VDemyanovAT';
export const RT_SECRET_KEY = 'VDemyanovRT';
export const SECRET_KEY = 'VDEMYANOV';

export function generateTokens(userId, username, role) {
  const payload = { id: userId, username: username, role: role };
  const accessToken = jwt.sign(payload, AT_SECRET_KEY, { expiresIn: '30d' });
  const refreshToken = jwt.sign(payload, RT_SECRET_KEY, { expiresIn: '30d' });
  console.log(accessToken);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

export async function updateRefreshToken(userId, refreshToken) {
  const user = await User.findByPk(userId);
  user.refreshToken = refreshToken;
  await user.save();
}

export async function putTokenInBlacklist(token) {
  await redisClient.set(token);
}

export async function isTokenInBlacklist(token) {
  return !isNil(await redisClient.get(token));
}

/*
  user - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJ1c2VyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NTI2NTU1NTYsImV4cCI6MTY1NTI0NzU1Nn0.lwV1wm1O0g7YLh2t2FNasEAvafFFYAS6HLYf-ys9YgQ
  admin - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MjY1Mjg4MSwiZXhwIjoxNjU1MjQ0ODgxfQ.tdhBtpbcd-WOlnb227GHbusOgJweAB0-PDBtuAiIBNs
 */