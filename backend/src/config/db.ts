import { Pool } from 'pg';
import { envs } from './env';

export const pool = new Pool({
  host: envs.DB_HOST,
  port: envs.DB_EXT_PORT,
  database: envs.DB_NAME,
  user: envs.DB_USER,
  password: envs.DB_PASS,
});
