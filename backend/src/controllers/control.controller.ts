import { RequestHandler } from "express";
import { pool } from "../config/db";

export const getAllControl: RequestHandler = async (req, res) => {
  const dbResponse = await pool.query('SELECT * FROM control');
  return res.json(dbResponse.rows);
}

export const getControlByMonth: RequestHandler = async (req, res) => {
  const { mes } = req.params;
  const dbResponse = await pool.query('SELECT * FROM control WHERE MES = $1', [mes]);
  return res.json(dbResponse.rows);
}

export const getControlByMonthAndMovil: RequestHandler = async (req, res) => {
  const { mes, movil } = req.params;
  const dbResponse = await pool.query('SELECT * FROM control WHERE MES = $1 AND movil = $2', [mes, movil]);
  return res.json(dbResponse.rows);
}
