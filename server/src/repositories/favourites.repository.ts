import { pool } from '@/db/pool';

import type { IItem } from '@/types/item';

export async function getFavouritesById(ids: number[]): Promise<IItem[]> {
  if (ids.length === 0) return [];

  const result = await pool.query<IItem>(
    `
      SELECT
        m.examine,
        m.id,
        m.members,
        m.lowalch,
        m.item_limit AS "limit",
        m.value,
        m.highalch,
        REPLACE(m.icon, ' ', '_') AS icon,
        m.name,
        l.high,
        l.high_time::int AS "highTime",
        l.low,
        l.low_time::int AS "lowTime",
        l.volume::int AS "volume",
        l.updated_at AS "updatedAt"
      FROM mapping m
      LEFT JOIN latest l
        ON l.id = m.id
      WHERE m.id = ANY($1::int[])
    `,
    [ids],
  );

  const byId = new Map<number, IItem>();
  for (const row of result.rows) {
    byId.set(row.id, row);
  }

  const items: IItem[] = [];
  for (const id of ids) {
    const item = byId.get(id);
    if (!item) continue;
    items.push(item);
  }

  return items;
}
