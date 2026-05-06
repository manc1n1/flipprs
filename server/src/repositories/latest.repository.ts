import { pool } from '@/db/pool';

import type { IWikiLatestResponse, IWikiVolumesResponse } from '@/types/wiki';

export async function upsertLatest(
  latest: IWikiLatestResponse['data'],
  volumes: IWikiVolumesResponse['data'],
): Promise<number[]> {
  const latestIds = Object.keys(latest);

  if (latestIds.length === 0) return [];

  const mappingIdsMatchingLatest = await pool.query<{ id: number }>(
    `
      SELECT id
      FROM mapping
      WHERE id = ANY($1)
    `,
    [latestIds],
  );

  const validIds = mappingIdsMatchingLatest.rows.map((row) => String(row.id));

  if (validIds.length === 0) return [];

  const ids: number[] = [];
  const highs: number[] = [];
  const highTimes: number[] = [];
  const lows: number[] = [];
  const lowTimes: number[] = [];
  const volumeValues: number[] = [];

  for (const id of validIds) {
    const item = latest[id]!;

    ids.push(Number(id));
    highs.push(item.high);
    highTimes.push(item.highTime);
    lows.push(item.low);
    lowTimes.push(item.lowTime);
    volumeValues.push(volumes[id]!);
  }

  const result = await pool.query<{ id: number }>(
    `
      INSERT INTO latest (
        id,
        high,
        high_time,
        low,
        low_time,
        volume
      )
      SELECT *
      FROM UNNEST(
        $1::int[],
        $2::int[],
        $3::bigint[],
        $4::int[],
        $5::bigint[],
        $6::bigint[]
      )
      AS incoming(
        id,
        high,
        high_time,
        low,
        low_time,
        volume
      )
      ON CONFLICT (id)
      DO UPDATE SET
        high = EXCLUDED.high,
        high_time = EXCLUDED.high_time,
        low = EXCLUDED.low,
        low_time = EXCLUDED.low_time,
        volume = EXCLUDED.volume,
        updated_at = NOW()
      WHERE
        latest.high IS DISTINCT FROM EXCLUDED.high
        OR latest.high_time IS DISTINCT FROM EXCLUDED.high_time
        OR latest.low IS DISTINCT FROM EXCLUDED.low
        OR latest.low_time IS DISTINCT FROM EXCLUDED.low_time
        OR latest.volume IS DISTINCT FROM EXCLUDED.volume
      RETURNING id
    `,
    [ids, highs, highTimes, lows, lowTimes, volumeValues],
  );

  return result.rows.map((row) => row.id);
}
