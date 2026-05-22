import { request } from '@/api/client';

import { TFavouritesResponse } from '@/types/favourites';

export function getFavourites(ids: number[]): Promise<TFavouritesResponse> {
  return request<TFavouritesResponse>(`/favourites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    cache: 'no-store',
  });
}
