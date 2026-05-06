import { request } from '@/api/client';

import type { TTimeseries } from '@/types/chart';

export function getTimeseries(
  timestep: string,
  itemId: number,
): Promise<TTimeseries[]> {
  return request<TTimeseries[]>(
    `/timeseries?timestep=${encodeURIComponent(timestep)}&id=${encodeURIComponent(itemId)}`,
    { cache: 'no-store' },
  );
}
