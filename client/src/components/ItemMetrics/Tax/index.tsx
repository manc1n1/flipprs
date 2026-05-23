import styles from '../ItemMetrics.module.css';

import { getItemMetrics } from '@/utils/metrics';

import type { TItem } from '@/types/item';

export function Tax({ item }: { item: TItem }) {
  const { formattedTax } = getItemMetrics(item);

  return (
    <div className={styles.price}>
      <div className={styles.negative}>{formattedTax}</div>
      <span className={styles.currency}>GP</span>
    </div>
  );
}
