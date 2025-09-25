import { Request, RequestHandler, Response } from "express";
import { RequestWithUser, User } from "../middlewares/auth.middleware";
import { signToken } from "../utils/jwt";
import { comparePassword } from "../utils/password";

export const login = (req: Request, res: Response) => {
  const { user, password } = req.body;
  if (!(user === 'admin' && comparePassword(password, 'admin'))) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }
  const payload = { user };
  const token = signToken(payload);
  return res.send({ token });
}

export const me = (req: RequestWithUser, res: Response) => {
  return res.send(req.user);
}

export const register: RequestHandler = (req, res) => {
  return res.send('Ups! This is not implemented yet');
}
