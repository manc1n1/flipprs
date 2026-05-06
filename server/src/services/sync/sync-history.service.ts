import { upsertHistoryTimeseries } from '@/repositories/history.repository';

import { fetchHistoryTimeseries } from '@/services/wiki.service';

import { logger } from '@/utils/logger';

export async function syncHistoryTimeseries(id: number): Promise<void> {
  const response = await fetchHistoryTimeseries(id);
  const points = response[String(id)] ?? [];

  const deltaCount = await upsertHistoryTimeseries(id, points);

  logger.debug('History sync complete', {
    id,
    upstreamCount: points.length,
    deltaCount: deltaCount.length,
  });
}
