import { useQuery } from '@tanstack/react-query';

import { getSearchItems } from '@/api/searchItems';

import type { TSearchItem } from '@/types/item';

export function useItemsQuery() {
  return useQuery<TSearchItem[]>({
    queryKey: ['searchItems'],
    queryFn: getSearchItems,
  });
}
