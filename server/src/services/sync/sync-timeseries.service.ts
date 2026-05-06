import {
  getNewestTimeseriesTimestamp,
  trimTimeseriesToLimit,
  upsertTimeseries,
} from '@/repositories/timeseries.repository';

import { fetchTimeseries } from '@/services/wiki.service';

import { logger } from '@/utils/logger';

import type { ISyncTimeseriesResult, TTimestep } from '@/types/timeseries';

export async function syncTimeseries(
  id: number,
  timestep: TTimestep,
): Promise<ISyncTimeseriesResult> {
  const newestStoredTimestamp = await getNewestTimeseriesTimestamp(
    id,
    timestep,
  );
  const response = await fetchTimeseries(timestep, id);

  const incomingPoints =
    newestStoredTimestamp == null
      ? response
      : response.filter((point) => point.timestamp >= newestStoredTimestamp);

  const addedCount = await upsertTimeseries(id, timestep, incomingPoints);
  const deletedCount = await trimTimeseriesToLimit(id, timestep);

  const result: ISyncTimeseriesResult = {
    id,
    timestep,
    upstreamCount: response.length,
    candidateCount: incomingPoints.length,
    addedCount,
    deletedCount,
  };

  logger.debug('Timeseries sync complete', { result });

  return result;
}
