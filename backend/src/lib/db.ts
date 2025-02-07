import { Pool } from "pg";

let pool: Pool = new Pool({
  user: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  host: process.env.PGSQL_HOST,
  port: parseInt(<string>process.env.PGSQL_PORT, 10) || 5432,
  database: process.env.PGSQL_DATABASE,
});

// to reference the db, simply import this file
export default pool;
