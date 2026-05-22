import { useQuery } from '@tanstack/react-query';

import { getHistoryTimeseries } from '@/api/historyTimeseries';

import { THistoryTimeseries } from '@/types/chart';

export function useHistoryTimeseriesQuery(enabled: boolean, itemId: string) {
  return useQuery<THistoryTimeseries[]>({
    queryKey: ['history', itemId],
    queryFn: () => getHistoryTimeseries(itemId),
    enabled: Boolean(enabled && itemId),
  });
}
