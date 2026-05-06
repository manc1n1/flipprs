import styles from '../ItemMetrics.module.css';

import { useItemMetrics } from '@/hooks/useItemMetrics';

import { TItem } from '@/types/item';

export function Margin({ item }: { item: TItem }) {
  const { marginValue, marginText, isNegative } = useItemMetrics(item);

  return (
    <div className={styles.price}>
      <div
        className={
          isNegative(marginValue)
            ? styles.negative
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
