import { getHistoryById } from '@/repositories/history.repository';

import { syncHistoryTimeseries } from '@/services/sync/sync-history.service';

import type { IHistoryTimeseriesPoint } from '@/types/history';

export async function getHistoryTimeseriesById(
  id: number,
): Promise<IHistoryTimeseriesPoint[]> {
  await syncHistoryTimeseries(id);

  return getHistoryById(id);
}
