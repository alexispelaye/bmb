import express from 'express';
import { verifyToken } from '../utils/jwt';

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
    req.user = decoded;
    next();
}