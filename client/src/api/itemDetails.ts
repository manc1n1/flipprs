import { request } from '@/api/client';

import type { TItem } from '@/types/item';

export function getItemDetails(itemId: number): Promise<TItem> {
  return request<TItem>(
    `/items/${encodeURIComponent(encodeURIComponent(itemId))}`,
    {
      cache: 'no-store',
    },
  );
}
