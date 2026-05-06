import { pool } from '@/db/pool';

import type { IWikiMappingItem } from '@/types/wiki';

export async function upsertMapping(items: IWikiMappingItem[]): Promise<void> {
  if (items.length === 0) return;

  const values: unknown[] = [];
  const placeholders = items.map((item, index) => {
    const offset = index * 9;

    values.push(
      item.examine,
      item.id,
      item.members,
      item.lowalch,
      item.limit,
      item.value,
      item.highalch,
      item.icon,
      item.name,
    );

    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`;
  });

  await pool.query(
    `
      INSERT INTO mapping (
        examine,
        id,
        members,
        lowalch,
        item_limit,
        value,
        highalch,
        icon,
        name
      )
      VALUES ${placeholders.join(', ')}
      ON CONFLICT (id)
      DO UPDATE SET
        examine = EXCLUDED.examine,
        members = EXCLUDED.members,
        lowalch = EXCLUDED.lowalch,
        item_limit = EXCLUDED.item_limit,
        value = EXCLUDED.value,
        highalch = EXCLUDED.highalch,
        icon = EXCLUDED.icon,
        name = EXCLUDED.name,
        updated_at = NOW()
    `,
    values,
  );
}
