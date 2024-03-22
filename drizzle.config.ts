import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error('DB_URL environment variable is not defined.');
}

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: DB_URL,
  },
} satisfies Config;
