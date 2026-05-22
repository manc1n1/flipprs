import { request } from '@/api/client';

import type { THistoryTimeseries } from '@/types/chart';

export function getHistoryTimeseries(
  itemId: string,
): Promise<THistoryTimeseries[]> {
  return request<THistoryTimeseries[]>(
    `/history/${encodeURIComponent(itemId)}`,
  );
}
