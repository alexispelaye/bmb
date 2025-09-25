import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export type User = {
  user: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export default (req: RequestWithUser, res: Response, next: NextFunction) => {
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
