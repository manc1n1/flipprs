import { getFavouritesById } from '@/repositories/favourites.repository';

import type { TFavouritesResponse } from '@/types/favourites';

export async function getFavourites(
  ids: number[],
): Promise<TFavouritesResponse> {
  const itemIds = [...new Set(ids)];

  if (itemIds.length === 0) return [];

  return getFavouritesById(itemIds);
}
