import { RequestHandler } from "express";
import { RequestWithUser } from "../middlewares/auth.middleware";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { pool } from "../config/db";

export const login: RequestHandler = async (req, res) => {
  console.log(req)
  const { usuario, password } = req.body;
  const contraseña = password;
  const dbResponse = await pool.query('SELECT * FROM usuario as u WHERE u.usuario = $1', [usuario]);
  if (!dbResponse.rows.length) {
    return res.status(401).json({
      message: 'Invalid credentials'
    })
  }
  const dbUser = dbResponse.rows[0];
  if (!comparePassword(contraseña, dbUser.contraseña)) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }
  const payload = { usuario, role: dbUser.role, id: dbUser.id };
  const token = signToken(payload);
  return res.send({ token });
}

export const me: RequestHandler = (req: RequestWithUser, res) => {
  return res.send(req.user);
}

export const registerBombero: RequestHandler = async (req, res) => {
  const { apellido, movil, nombre, tipo_bombero, genero } = req.body;
  for (const key in ['apellido', 'movil', 'nombre', 'tipo_bombero', 'genero']) {
    if (req.body[key] === undefined) {
      return res.status(400).json({
        message: `${key} is required`
      })
    }
  }
  if (!(genero.toLowerCase() === 'f' || genero.toLowerCase() === 'm')) {
    return res.status(400).json({
      message: 'Genero invalido'
    })
  }

  if (!(tipo_bombero.toLowerCase() === 'voluntario' || tipo_bombero.toLowerCase() === 'fijo')) {
    return res.status(400).json({
      message: 'Tipo de bombero invalido'
    })
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const user = `${apellido}_${movil}`;
    const dbResponse = await client.query('SELECT * FROM usuario as u WHERE u.usuario = $1', [user]);
    if (dbResponse.rows.length) {
      res.status(400).json({
        message: 'User already exists'
      })
      throw new Error('User already exists');
    }
    const createUserResponse = await client.query(
      'INSERT INTO usuario (usuario, contraseña) VALUES ($1, $2) RETURNING id',
      [user, hashPassword(user)]
    );

    const userId = createUserResponse.rows[0].id;

    const createBomberoResponse = await client.query(
      'INSERT INTO bombero (genero, apellido, nombre, movil, id_usuario, tipo_bombero) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [genero, apellido, nombre, movil, userId, tipo_bombero]
    );

    await client.query('COMMIT');

    return res.status(201).json({});
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({
      message: 'Error al registrar el usuario'
    });
    console.error(error);
  } finally {
    client.release()
  }
}

export const changePassword: RequestHandler = async (req: RequestWithUser, res) => {
  const { contraseña } = req.body;
  const user = req.user;
  const dbResponse = await pool.query('SELECT * FROM usuario WHERE usuario = $1', [user.usuario]);
  if (!dbResponse.rows.length) {
    return res.status(401).json({
      message: 'Invalid credentials'
    })
  }
  const update = await pool.query('UPDATE usuario SET contraseña = $1 WHERE usuario = $2', [hashPassword(contraseña), user.usuario]);
  res.status(201).json({
    message: 'Password changed'
  })
}


export const registerAdmin: RequestHandler = async (req: RequestWithUser, res) => {
  const { usuario, contraseña } = req.body;
  const dbResponse = await pool.query('SELECT * FROM usuario as u WHERE u.usuario = $1', [usuario]);
  if (dbResponse.rows.length) {
    return res.status(400).json({
      message: 'User already exists'
    })
  };
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const createUserResponse = await client.query(
      'INSERT INTO usuario (usuario, contraseña, role) VALUES ($1, $2, $3) RETURNING id',
      [usuario, hashPassword(contraseña), 'admin']
    );
    const userId = createUserResponse.rows[0].id;

    const createAdminResponse = await client.query(
      'INSERT INTO administrador (id_usuario) VALUES ($1) RETURNING id',
      [userId]
    );

    return res.status(201).json({
      message: 'Admin created'
    })
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({
      message: 'Error al registrar el usuario'
    });
  } finally {
    client.release()
  }
}
