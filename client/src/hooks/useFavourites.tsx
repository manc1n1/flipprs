import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { HeartMinus, HeartPlus, Trash2 } from 'lucide-react';

import {
  getAllFavourites,
  getFavourite,
  setFavourite,
  deleteFavourite,
  deleteAllFavourites,
} from '@/db/favouritesDB';

export function useFavourites() {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(true);
  const toastId = useRef<string | number>('favourite-toast');
  const bc = useRef<BroadcastChannel | null>(null);

  const refresh = useCallback(async () => {
    setIsLoadingFavourites(true);
    await getAllFavourites()
      .then((itemIds) => setFavourites(itemIds))
      .finally(() => setIsLoadingFavourites(false));
  }, []);

  useEffect(() => {
    refresh();

    bc.current = new BroadcastChannel('favourites-sync');
    bc.current.onmessage = () => void refresh();

    return () => {
      bc.current?.close();
      bc.current = null;
    };
  }, [refresh]);

  const bcChange = useCallback(() => {
    bc.current?.postMessage('update');
  }, []);

  const showToast = useCallback((removed: boolean) => {
    const message = removed ? 'Removed favourite' : 'Added favourite';
    const icon = removed ? <HeartMinus /> : <HeartPlus />;

    if (removed) {
      toast.error(message, {
        id: toastId.current,
        icon,
        duration: 1500,
      });

      return;
    }

    toast.success(message, {
      id: toastId.current,
      icon,
      duration: 1500,
    });
  }, []);

  const toggleFavourite = useCallback(
    async (itemId: number) => {
      const isFav = await getFavourite(itemId);

      if (isFav) {
        await deleteFavourite(itemId);
      } else {
        await setFavourite(itemId);
      }

      setFavourites((prev) =>
        isFav ? prev.filter((id) => id !== itemId) : [...prev, itemId],
      );

      showToast(isFav);
      bcChange();
    },
    [bcChange, showToast],
  );

  const deleteAll = useCallback(async () => {
    await deleteAllFavourites();
    setFavourites([]);

    toast.error('Cleared favourites', {
      id: 'clear-favourites-toast',
      icon: <Trash2 />,
      duration: 1500,
    });

    bcChange();
  }, [bcChange]);

  const isFavourite = useCallback(
    (itemId: number) => favourites.includes(itemId),
    [favourites],
  );

  return {
    favourites,
    isLoadingFavourites,
    toggleFavourite,
    isFavourite,
    refresh,
    deleteAll,
  };
}
