import { Request, RequestHandler, Response } from "express";
import { RequestWithUser, User } from "../middlewares/auth.middleware";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { pool } from "../config/db";

export const login = async (req: Request, res: Response) => {
  const { user, password } = req.body;
  const dbResponse = await pool.query('SELECT * FROM users WHERE username = $1', [user]);
  if (!dbResponse.rows.length) {
    return res.status(401).json({
      message: 'Invalid credentials'
    })
  }
  const dbUser = dbResponse.rows[0];
  if (!comparePassword(password, dbUser['password'])) {
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

export const register: RequestHandler = async (req, res) => {
  const { user, password, email } = req.body;
  if (user === undefined) {
    return res.status(400).json({
      message: 'Username is required'
    })
  }
  if (password === undefined) {
    return res.status(400).json({
      message: 'Password is required'
    })
  }
  if (email === undefined) {
    return res.status(400).json({
      message: 'Email is required'
    })
  }
  const dbResponse = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (dbResponse.rows.length) {
    return res.status(400).json({
      message: 'User already exists 1'
    })
  }
  const createUserResponse = await pool.query('INSERT INTO users (email, password, username) VALUES ($1, $2, $3)', [email, hashPassword(password), user]);
  if (!createUserResponse.rowCount) {
    return res.status(400).json({
      message: 'User already exists 2'
    })
  }
  return res.status(201).json({});
}
