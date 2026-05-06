import { useQuery } from '@tanstack/react-query';

import { getItemDetails } from '@/api/itemDetails';

import type { TItem } from '@/types/item';

export function useItemDetailQuery(itemId: number) {
  const query = useQuery<TItem>({
    queryKey: ['itemDetails', itemId],
    queryFn: () => getItemDetails(itemId),

    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: 55_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  return {
    item: query.data,
    loading: query.isLoading || query.isFetching,
    notFound: query.data === null,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
