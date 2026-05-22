import { useQuery } from '@tanstack/react-query';

import { getTimeseries } from '@/api/timeseries';

import type { TTimeseries } from '@/types/chart';

export function useTimeseriesQuery(timestep: string | null, itemId: number) {
  const query = useQuery<TTimeseries[]>({
    queryKey: ['timeseries', itemId, timestep] as const,
    queryFn: () => getTimeseries(timestep!, itemId),
    enabled: Boolean(timestep),

    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: !timestep ? false : 55_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  return {
    timeseries: query.data,
    loading: query.isLoading,
    refreshing: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
