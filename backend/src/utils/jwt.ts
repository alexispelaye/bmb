import jwt from 'jsonwebtoken';
import config from '../config/jwt';
import { User } from '../middlewares/auth.middleware';

export const signToken = (payload: User) => {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.accessTokenExpiration
  });
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.secret) as User;
  } catch (err) {
    return null;
  }
}
