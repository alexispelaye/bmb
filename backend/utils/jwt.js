import jwt from 'jsonwebtoken';
import config from '../config/jwt';

export const signToken = (payload) => {
    return jwt.sign(payload, config.secret, {
        expiresIn: config.accessTokenExpiration
    });
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.secret);
    } catch (err) {
        return null;
    }
}