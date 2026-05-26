import styles from '../ItemMetrics.module.css';

import type { TItem } from '@/types/item';

export function BuyLimit({ item }: { item: TItem }) {
  return (
    <div className={!item.limit ? styles.bold : ''}>
      {!item.limit ? '-' : item.limit.toLocaleString()}
    </div>
  );
}
