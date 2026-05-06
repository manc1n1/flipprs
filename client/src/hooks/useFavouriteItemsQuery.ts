import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getFavourites } from '@/api/favourites';

import type { TFavouritesResponse } from '@/types/favourites';

export function useFavouriteItemsQuery({
  favourites,
  isLoadingFavourites,
}: {
  favourites: number[];
  isLoadingFavourites: boolean;
}) {
  const favouriteIds = useMemo(
    () => [...favourites].sort((a, b) => a - b),
    [favourites],
  );

  const hasFavourites = favouriteIds.length > 0;
  const idsParam = useMemo(() => favouriteIds.join(','), [favouriteIds]);

  const query = useQuery<TFavouritesResponse>({
    queryKey: ['favouriteItems', idsParam] as const,
    queryFn: () => getFavourites(favouriteIds),
    enabled: !isLoadingFavourites && hasFavourites,
    placeholderData: (prev) => prev,

    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: !isLoadingFavourites && hasFavourites ? 55_000 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  return {
    favItems: hasFavourites ? (query.data ?? []) : [],
    loading: isLoadingFavourites || query.isLoading,
    refreshing: hasFavourites ? query.isFetching : false,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
