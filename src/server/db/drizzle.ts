import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error('DB_URL environment variable is not defined.');
}

// const sql = neon(DB_URL);
// const db = drizzle(sql, { schema });

const pool = new Pool({ connectionString: DB_URL });
const db = drizzle({ client: pool, schema: schema });

export default db;
