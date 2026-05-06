import { pool } from '@/db/pool';

import type { IHistoryTimeseriesPoint } from '@/types/history';
import type { IWikiHistoryTimeseriesPoint } from '@/types/wiki';

export async function getHistoryById(
  id: number,
): Promise<IHistoryTimeseriesPoint[]> {
  const result = await pool.query<IHistoryTimeseriesPoint>(
    `
      SELECT
        id,
        price,
        volume,
        timestamp,
        created_at AS "createdAt"
      FROM history
      WHERE id = $1
      ORDER BY timestamp ASC
    `,
    [id],
  );

  return result.rows.map((row) => ({
    ...row,
    volume: Number(row.volume),
    timestamp: Number(row.timestamp),
  }));
}

export async function upsertHistoryTimeseries(
  id: number,
  points: IWikiHistoryTimeseriesPoint[],
): Promise<number[]> {
  if (points.length === 0) return [];

  const ids: number[] = [];
  const prices: number[] = [];
  const volumes: number[] = [];
  const timestamps: number[] = [];

  for (const point of points) {
    ids.push(id);
    prices.push(point.price);
    volumes.push(point.volume);
    timestamps.push(point.timestamp);
  }

  const result = await pool.query<{ id: number; timestamp: number }>(
    `
      INSERT INTO history (
        id,
        price,
        volume,
        timestamp
      )
      SELECT *
      FROM UNNEST(
        $1::int[],
        $2::int[],
        $3::bigint[],
        $4::bigint[]
      )
      AS incoming(
        id,
        price,
        volume,
        timestamp
      )
      ON CONFLICT (id, timestamp)
      DO UPDATE SET
        price = EXCLUDED.price,
        volume = EXCLUDED.volume,
        created_at = NOW()
      WHERE
        history.price IS DISTINCT FROM EXCLUDED.price
        OR history.volume IS DISTINCT FROM EXCLUDED.volume
      RETURNING id
    `,
    [ids, prices, volumes, timestamps],
  );

  return result.rows.map((row) => row.id);
}
