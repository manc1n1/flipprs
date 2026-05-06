import type { PoolClient } from 'pg';

import type { TTimestep } from '@/types/timeseries';

const TIMESTEP_LOCK_KEY: Record<TTimestep, number> = {
  '5m': 1,
  '1h': 2,
  '6h': 3,
  '24h': 4,
};

function getTimeseriesLockKey(
  id: number,
  timestep: TTimestep,
): [number, number] {
  return [id, TIMESTEP_LOCK_KEY[timestep]];
}

export async function tryAcquireTimeseriesLock(
  client: PoolClient,
  id: number,
  timestep: TTimestep,
): Promise<boolean> {
  const [key1, key2] = getTimeseriesLockKey(id, timestep);

  const result = await client.query<{ locked: boolean }>(
    `
      SELECT pg_try_advisory_lock($1, $2) AS locked
    `,
    [key1, key2],
  );

  return result.rows[0]?.locked ?? false;
}

export async function releaseTimeseriesLock(
  client: PoolClient,
  id: number,
  timestep: TTimestep,
): Promise<boolean> {
  const [key1, key2] = getTimeseriesLockKey(id, timestep);

  const result = await client.query<{ unlocked: boolean }>(
    `
      SELECT pg_advisory_unlock($1, $2) AS unlocked
    `,
    [key1, key2],
  );

  return result.rows[0]?.unlocked ?? false;
}
