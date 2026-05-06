import { pool } from '@/db/pool';
import {
  releaseTimeseriesLock,
  tryAcquireTimeseriesLock,
} from '@/db/advisory-lock';

import { syncTimeseries } from '@/services/sync/sync-timeseries.service';

import { logger } from '@/utils/logger';

import type { ISyncTimeseriesResult, TTimestep } from '@/types/timeseries';

const inFlightTimeseriesSyncs = new Map<
  string,
  Promise<ISyncTimeseriesResult>
>();

function getTimeseriesSyncKey(id: number, timestep: TTimestep): string {
  return `${id}:${timestep}`;
}

async function runLockedTimeseriesSync(
  id: number,
  timestep: TTimestep,
): Promise<ISyncTimeseriesResult> {
  const client = await pool.connect();
  let lockAcquired = false;

  try {
    lockAcquired = await tryAcquireTimeseriesLock(client, id, timestep);

    if (!lockAcquired) {
      logger.debug(
        'Timeseries advisory lock unavailable; waiting for active sync',
        {
          id,
          timestep,
        },
      );

      return {
        id,
        timestep,
        upstreamCount: 0,
        candidateCount: 0,
        addedCount: 0,
        deletedCount: 0,
      };
    }

    return await syncTimeseries(id, timestep);
  } catch (error) {
    logger.error('Timeseries sync failed', {
      id,
      timestep,
      error,
    });

    throw error;
  } finally {
    if (lockAcquired) {
      try {
        await releaseTimeseriesLock(client, id, timestep);
      } catch (unlockError) {
        logger.error('Failed to release timeseries advisory lock', {
          id,
          timestep,
          error: unlockError,
        });
      }
    }

    client.release();
  }
}

export async function runSyncTimeseries(
  id: number,
  timestep: TTimestep,
): Promise<ISyncTimeseriesResult> {
  const key = getTimeseriesSyncKey(id, timestep);

  const existingSync = inFlightTimeseriesSyncs.get(key);
  if (existingSync) {
    logger.debug('Joining in-flight timeseries sync', {
      id,
      timestep,
    });

    return existingSync;
  }

  const syncPromise = runLockedTimeseriesSync(id, timestep).finally(() => {
    inFlightTimeseriesSyncs.delete(key);
  });

  inFlightTimeseriesSyncs.set(key, syncPromise);

  return syncPromise;
}
