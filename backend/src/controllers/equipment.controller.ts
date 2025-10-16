import { RequestHandler } from "express";
import { pool } from "../config/db";

export const getEquipment: RequestHandler = async (req, res) => {
  const dbResponse = await pool.query('SELECT * FROM equipamiento');
  return res.json(dbResponse.rows);
}

export const getEquipmentById: RequestHandler  = async (req, res) => {
  const { id } = req.params;
  const dbResponse = await pool.query('SELECT * FROM equipamiento WHERE id = $1', [id]);
  return res.json(dbResponse.rows);
}

export const createEquipment: RequestHandler  = async (req, res) => {
  const { nombre } = req.body;
  const dbResponse = await pool.query('INSERT INTO equipamiento (nombre) VALUES ($1)', [nombre]);
  if (!dbResponse.rowCount) {
    return res.status(400).send({
      message: 'Error: el equipamiento ya existe'
    })
  }
  return res.status(201).send();
}

export const updateEquipmentStatus: RequestHandler = async (req, res) => {
  const { id, esta } = req.body;
  const dbResponse = await pool.query('UPDATE equipamiento_bombero SET esta = $1 WHERE id_equipamiento = $2', [esta, id]);
  if (!dbResponse.rowCount) {
    return res.status(400).send({
      message: 'Error: el equipamiento ya existe'
    })
  }
  return res.status(201).send();
}
