import { pool } from '@/db/pool';

import type { IItem, ISearchItem } from '@/types/item';

export async function getSearchItems(): Promise<ISearchItem[]> {
  const result = await pool.query<ISearchItem>(
    `
      SELECT
        l.id,
        REPLACE(m.icon, ' ', '_') AS icon,
        m.name
      FROM latest l
      LEFT JOIN mapping m ON m.id = l.id
      ORDER BY m.name ASC
    `,
  );

  return result.rows;
}

export async function getItemById(id: number): Promise<IItem> {
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
      WHERE m.id = $1
    `,
    [id],
  );

  const item = result.rows[0];

  if (!item) {
    throw new Error('Item not found');
  }

  return item;
}
