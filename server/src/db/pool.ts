import { Pool } from 'pg';

import { env } from '@/config/env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

export async function testDbConnection(): Promise<void> {
  const result = await pool.query('SELECT NOW() AS now');

  console.log('Database connected:', result.rows[0].now);
}
