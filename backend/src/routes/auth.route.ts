import { Router } from 'express';
import { registerBombero, registerAdmin, login, me, changePassword } from '../controllers/auth.controller';
import { pool } from '../config/db';
import { hashPassword } from '../utils/password';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/test', async (req, res) => {
  const rows = await pool.query('SELECT * FROM usuario');
  console.log(req.body);
  const adminExists = await pool.query('SELECT * FROM usuario WHERE role = $1', ['admin']);
  if (!adminExists.rows.length) {
    await pool.query('INSERT INTO usuario (usuario, contraseña, role) VALUES ($1, $2, $3)', ['admin', hashPassword('admin'), 'admin']);
    return res.json({
      message: 'done :)'
    })
  }
  return res.json(rows.rows);
})

router.post('/registrar-bombero', authMiddleware, registerBombero);
router.post('/cambiar-contraseña', authMiddleware, changePassword);
router.post('/registrar-admin', registerAdmin);
router.post('/login', login);
router.get('/me', authMiddleware, me);

export default router;
