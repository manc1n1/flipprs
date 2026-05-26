import styles from '../ItemMetrics.module.css';

import { getItemMetrics } from '@/utils/metrics';

import type { TItem } from '@/types/item';

export function Margin({ item }: { item: TItem }) {
  const { marginValue, marginText, isNegative } = getItemMetrics(item);

  return (
    <div className={styles.price}>
      <div
        className={
          isNegative(marginValue)
            ? styles.negative
            : marginText === '-'
              ? styles.bold
              : marginValue === 0
                ? ''
                : styles.positive
        }
      >
        {marginText}
      </div>
      <span className={styles.currency}>GP</span>
    </div>
  );
}
