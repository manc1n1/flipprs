import { pool } from '@/db/pool';

import type { ITimeseriesPoint, TTimestep } from '@/types/timeseries';
import type { IWikiTimeseriesPoint } from '@/types/wiki';

export async function getNewestTimeseriesTimestamp(
  id: number,
  timestep: TTimestep,
): Promise<number | null> {
  const result = await pool.query<{ timestamp: number }>(
    `
      SELECT timestamp
      FROM timeseries
      WHERE id = $1
        AND timestep = $2
      ORDER BY timestamp DESC
      LIMIT 1
    `,
    [id, timestep],
  );

  return result.rows[0]?.timestamp ?? null;
}

export async function upsertTimeseries(
  id: number,
  timestep: TTimestep,
  points: IWikiTimeseriesPoint[],
): Promise<number> {
  if (points.length === 0) return 0;

  const ids: number[] = [];
  const timesteps: string[] = [];
  const timestamps: number[] = [];
  const avgHighPrices: number[] = [];
  const avgLowPrices: number[] = [];
  const highPriceVolumes: number[] = [];
  const lowPriceVolumes: number[] = [];

  for (const point of points) {
    ids.push(id);
    timesteps.push(timestep);
    timestamps.push(point.timestamp);
    avgHighPrices.push(point.avgHighPrice);
    avgLowPrices.push(point.avgLowPrice);
    highPriceVolumes.push(point.highPriceVolume);
    lowPriceVolumes.push(point.lowPriceVolume);
  }

  const result = await pool.query<{ id: number }>(
    `
      INSERT INTO timeseries (
        id,
        timestep,
        timestamp,
        avg_high_price,
        avg_low_price,
        high_price_volume,
        low_price_volume
      )
      SELECT *
      FROM UNNEST(
        $1::int[],
        $2::text[],
        $3::bigint[],
        $4::int[],
        $5::int[],
        $6::bigint[],
        $7::bigint[]
      )
      AS incoming(
        id,
        timestep,
        timestamp,
        avg_high_price,
        avg_low_price,
        high_price_volume,
        low_price_volume
      )
      ON CONFLICT (id, timestep, timestamp)
      DO UPDATE SET
        avg_high_price = EXCLUDED.avg_high_price,
        avg_low_price = EXCLUDED.avg_low_price,
        high_price_volume = EXCLUDED.high_price_volume,
        low_price_volume = EXCLUDED.low_price_volume,
        created_at = NOW()
      WHERE
        timeseries.avg_high_price IS DISTINCT FROM EXCLUDED.avg_high_price
        OR timeseries.avg_low_price IS DISTINCT FROM EXCLUDED.avg_low_price
        OR timeseries.high_price_volume IS DISTINCT FROM EXCLUDED.high_price_volume
        OR timeseries.low_price_volume IS DISTINCT FROM EXCLUDED.low_price_volume
      RETURNING id
    `,
    [
      ids,
      timesteps,
      timestamps,
      avgHighPrices,
      avgLowPrices,
      highPriceVolumes,
      lowPriceVolumes,
    ],
  );

  return result.rowCount ?? 0;
}

export async function trimTimeseriesToLimit(
  id: number,
  timestep: TTimestep,
  limit = 365,
): Promise<number> {
  const result = await pool.query(
    `
      DELETE FROM timeseries
      WHERE ctid IN (
        SELECT ctid
        FROM timeseries
        WHERE id = $1
          AND timestep = $2
        ORDER BY timestamp DESC
        OFFSET $3
      )
    `,
    [id, timestep, limit],
  );

  return result.rowCount ?? 0;
}

export async function getTimeseriesByIdAndTimestep(
  id: number,
  timestep: TTimestep,
): Promise<ITimeseriesPoint[]> {
  const result = await pool.query<ITimeseriesPoint>(
    `
      SELECT
        id,
        timestep,
        timestamp::int AS timestamp,
        avg_high_price AS "avgHighPrice",
        avg_low_price AS "avgLowPrice",
        high_price_volume AS "highPriceVolume",
        low_price_volume AS "lowPriceVolume",
        created_at AS "createdAt"
      FROM timeseries
      WHERE id = $1
        AND timestep = $2
      ORDER BY timestamp ASC
    `,
    [id, timestep],
  );

  return result.rows;
}
