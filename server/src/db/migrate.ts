import path from 'node:path';
import fs from 'node:fs/promises';

import { pool } from '@/db/pool';

import { logger } from '@/utils/logger';

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query(
      `
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id SERIAL PRIMARY KEY,
          filename TEXT NOT NULL UNIQUE,
          run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `,
    );

    const migrationsDir = path.join(process.cwd(), 'src', 'db', 'migrations');
    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    const { rows } = await client.query<{ filename: string }>(
      `SELECT filename FROM schema_migrations`,
    );

    const alreadyRun = new Set(rows.map((row) => row.filename));

    for (const file of files) {
      if (alreadyRun.has(file)) continue;

      const fullPath = path.join(migrationsDir, file);
      const sql = await fs.readFile(fullPath, 'utf8');

      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        `INSERT INTO schema_migrations (filename) VALUES ($1)`,
        [file],
      );
      await client.query('COMMIT');

      logger.info(`Applied migration: ${file}`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
