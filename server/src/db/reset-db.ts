import { pool } from '@/db/pool';

export async function resetDb(): Promise<void> {
  await pool.query(`
    TRUNCATE TABLE
      timeseries,
      latest,
      mapping
    CASCADE;  
  `);
}
