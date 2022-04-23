import jwt from 'jsonwebtoken';
import { User } from './db.js';
import { redisClient } from './redis.helper.js';
import pkg from 'lodash';

const { isNil } = pkg;

export const AT_SECRET_KEY = 'VDemyanovAT';
export const RT_SECRET_KEY = 'VDemyanovRT';
export const SECRET_KEY = 'VDEMYANOV';

export function generateTokens(userId, username) {
  const payload = { id: userId, username: username };
  const accessToken = jwt.sign(payload, AT_SECRET_KEY, { expiresIn: '30s' }); // '10m'
  const refreshToken = jwt.sign(payload, RT_SECRET_KEY, { expiresIn: '24h' });

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