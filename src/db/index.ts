import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import env from '../config/env';

const pool = new Pool({
  connectionString: env.DB_URL,
});

const db = drizzle(pool, { schema });

export default db;
