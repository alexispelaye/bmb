import { RequestHandler } from "express";
import { pool } from "../config/db";

export const getAll: RequestHandler = async (req, res) => {
  const dbResponse = await pool.query('SELECT * FROM equipamiento_bombero');
  return res.json(dbResponse);
}

export const updateStatus: RequestHandler = async (req, res) => {
  const { id, esta } = req.body;
  const dbResponse = await pool.query('UPDATE equipamiento_bombero SET esta = $1 WHERE id_equipamiento = $2', [esta, id]);
  if (!dbResponse.rowCount) {
    return res.status(400).send({
      message: 'Error: el equipamiento ya existe'
    })
  }
}
