import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { pool } from '../config/db';

const router = Router();
router.get('/test', async (req, res) => {
  const rows = await pool.query('SELECT * FROM users');
  console.log(rows);
  return res.json(rows);
})
router.post('/register', register);
router.post('/login', login);
router.get('/me', me);

export default router;
