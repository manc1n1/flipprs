import type { TItem } from '@/types/item';

export function BuyLimit({ item }: { item: TItem }) {
  return <div>{!item.limit ? '-' : item.limit.toLocaleString()}</div>;
}
