import { TItem } from '@/types/item';

export function BuyLimit({ item }: { item: TItem }) {
  return <div>{!item.limit ? 'N/A' : item.limit.toLocaleString()}</div>;
}
