import { Pool } from 'pg';
import 'dotenv/config';

const { DB_HOST, DB_USER, DB_PORT, DB_PWD, DB_NAME } = process.env;

export default new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PWD,
  port: Number(DB_PORT),
  database: DB_NAME,
});
