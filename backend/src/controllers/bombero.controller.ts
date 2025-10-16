import { RequestHandler } from "express";
import { pool } from "../config/db";

export const getAll: RequestHandler = async (req, res) => {
  const dbResponse = await pool.query('SELECT * FROM bombero');
  return res.json(dbResponse.rows);
}

export const getById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const dbResponse = await pool.query('SELECT * FROM bombero WHERE id = $1', [id])
  return res.json(dbResponse.rows);
}

export const getByMovil: RequestHandler = async (req, res) => {
  const { movil } = req.params;
  const dbResponse = await pool.query('SELECT * FROM bombero WHERE movil = $1', [movil])
  return res.json(dbResponse.rows);
}

export const create: RequestHandler = async (req, res) => {
  const { genero, apellido, nombre, movil } = req.body;
  const exist = await pool.query('SELECT * FROM bombero WHERE movil = $1', [movil]);
  if (exist.rows.length) {
    return res.status(409).send({
      message: 'Error: el bombero ya existe'
    })
  }
  const dbResponse = await pool.query('INSERT INTO bombero (genero, apellido, nombre, movil) VALUES ($1, $2, $3, $4)', [genero, apellido, nombre, movil]);
  if (!dbResponse.rowCount) {
    return res.status(400).send({
      message: 'Error al crear el bombero'
    })
  }
  return res.status(201).send();
}

export const addEquipment: RequestHandler = async (req, res) => {
  const { id_bombero, id_equipamiento } = req.body;
  const dbResponse = await pool.query('INSERT INTO equipamiento_bombero (id_bombero, id_equipamiento) VALUES ($1, $2)', [id_bombero, id_equipamiento]);
  if (!dbResponse.rowCount) {
    return res.status(400).send({
      message: 'Error al agregar el equipamiento'
    })
  }
}

export const getStats: RequestHandler = async (req, res) => {
  let stats = {
    activos: 0,
    ok: 0,
    danger: 0,
    warning: 0,
  }

  stats.activos = (await pool.query("SELECT COUNT(id) as total_bomberos FROM bombero")).rows[0].total_bomberos;
  const estados = (await pool.query("SELECT estado, COUNT(id) AS total FROM bombero GROUP BY estado ORDER BY total DESC")).rows;
  for (const estado of estados) {
    stats[estado.estado] = estado.total;
  }

  const newState = await pool.query(`
    SELECT
      COUNT(CASE WHEN estado_bombero = 'ok' THEN 1 END) AS ok,
      COUNT(CASE WHEN estado_bombero = 'warning' THEN 1 END) AS warning,
      COUNT(CASE WHEN estado_bombero = 'danger' THEN 1 END) AS danger
    FROM
      bombero_estado;`);
  stats = { ...stats, ...newState.rows[0] };
  return res.json(stats);
}

export const refresh: RequestHandler = async (req, res) => {
  const dbResponse = await pool.query("REFRESH MATERIALIZED VIEW bombero_estado");
  res.json(dbResponse);
}
