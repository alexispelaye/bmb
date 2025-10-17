import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export type User = {
  usuario: string;
  role: string;
  id: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }

  const [_, jwt] = token.split(' ');

  console.log(jwt)
  const decoded = verifyToken(jwt);
  if (!decoded) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
  req.user = decoded;
  next();
}
