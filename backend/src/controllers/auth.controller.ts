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

const userConflict = async (usuario: string, movil: string)=>{
  const {rows} = await pool.query(`
          SELECT EXISTS (
              SELECT 1 FROM usuario u WHERE u.usuario = $1
              UNION ALL
              SELECT 1 FROM bombero WHERE b.movil = $2
          ) AS conflict;
      `,[usuario, movil])
  return rows[0].conflict;
}

export const registerBombero: RequestHandler = async (req, res) => {
  const { apellido, movil, nombre, tipo, genero } = req.body;
  const keys = ['apellido', 'movil', 'nombre', 'genero', 'tipo'];
  for (const key of keys) {
    console.log(key, keys);
    if (req.body[key] === undefined) {
      console.log(req.body[key])
      return res.status(400).json({
        message: `${key} is required`
      })
    }
  }
  let procGenero = genero.toLowerCase()[0]
  switch (procGenero) {
    case 'f': {
      procGenero = 'Femenino';
      break;
    }
    case 'm': {
      procGenero = 'Masculino';
      break;
    }
    default: {
      return res.status(400).json({
        message: 'Genero invalido'
      })
    }
  }

  if (!(tipo.toLowerCase() === 'voluntario' || tipo.toLowerCase() === 'fijo')) {
    return res.status(400).json({
      message: 'Tipo de bombero invalido'
    })
  }
  const user = `${apellido}_${movil}`;

  if (userConflict(user, movil)) {
    res.status(409).json({
      message: 'Usuario/Movil en uso'
    })
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const createUserResponse = await client.query(
      'INSERT INTO usuario (usuario, contraseña) VALUES ($1, $2) RETURNING id',
      [user, hashPassword(user)]
    );

    const userId = createUserResponse.rows[0].id;

    await client.query(
      'INSERT INTO bombero (genero, apellido, nombre, movil, id_usuario, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [procGenero, apellido, nombre, movil, userId, tipo]
    );

    await client.query('COMMIT');

    res.status(201).json({});
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
