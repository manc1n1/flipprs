import { getTimeseriesByIdAndTimestep } from '@/repositories/timeseries.repository';

import { shouldRefreshTimeseries } from '@/services/timeseries-staleness.service';
import { runSyncTimeseries } from '@/services/sync/runners/sync-timeseries-runner.service';

import { logger } from '@/utils/logger';

import type { ITimeseriesPoint, TTimestep } from '@/types/timeseries';

export async function getTimeseries(
  id: number,
  timestep: TTimestep,
): Promise<ITimeseriesPoint[]> {
  return getTimeseriesByIdAndTimestep(id, timestep);
}

export async function getOrRefreshTimeseries(
  id: number,
  timestep: TTimestep,
): Promise<ITimeseriesPoint[]> {
  let storedTimeseries = await getTimeseries(id, timestep);

  const hasNoStoredTimeseries = storedTimeseries.length === 0;
  const requiresRefresh = hasNoStoredTimeseries
    ? true
    : await shouldRefreshTimeseries(id, timestep);

  if (!requiresRefresh) return storedTimeseries;

  try {
    await runSyncTimeseries(id, timestep);
  } catch (error) {
    logger.error('Timeseries sync failed', {
      id,
      timestep,
      trigger: hasNoStoredTimeseries ? 'missing_data' : 'stale_data',
      error,
    });
  }

  storedTimeseries = await getTimeseries(id, timestep);

  return storedTimeseries;
}
