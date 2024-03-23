import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error('DB_URL environment variable is not defined.');
}

const sql = neon(DB_URL);
const db = drizzle(sql, { schema });

export default db;
