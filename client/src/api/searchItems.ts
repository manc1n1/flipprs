import { request } from '@/api/client';

import type { TSearchItem } from '@/types/item';

export function getSearchItems(): Promise<TSearchItem[]> {
  return request<TSearchItem[]>(`/items`);
}
