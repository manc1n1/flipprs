import { pool } from '@/db/pool';

import { logger } from '@/utils/logger';

let validIdsCache = new Set<number>();

export async function refreshValidIdsCache(): Promise<void> {
  logger.info('Refreshing valid ids cache');

  const result = await pool.query<{ id: number }>(
    `
      SELECT m.id
      FROM mapping m
      INNER JOIN latest l
        ON l.id = m.id
    `,
  );

  const next = new Set<number>();

  for (const row of result.rows) {
    next.add(row.id);
  }

  validIdsCache = next;

  logger.info('Valid ids cache refreshed', {
    count: validIdsCache.size,
  });
}

export function isValidIdCached(id: number): boolean {
  return validIdsCache.has(id);
}
