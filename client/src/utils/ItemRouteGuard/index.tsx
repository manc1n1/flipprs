import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import Home from '@/pages/Home';

import { useItemsQuery } from '@/hooks/useItemsQuery';

export default function ItemRouteGuard() {
  const { itemId } = useParams();
  const id = Number(itemId);
  const { data: items = [], isPending } = useItemsQuery();

  const invalidParam = !Number.isFinite(id) || id <= 0;

  const exists = useMemo(
    () => items.some((item) => item.id === id),
    [items, id],
  );

  if (invalidParam)
    return (
      <Navigate
        to='/404'
        replace
      />
    );
  if (!isPending && !exists)
    return (
      <Navigate
        to='/404'
        replace
      />
    );

  return <Home />;
}
