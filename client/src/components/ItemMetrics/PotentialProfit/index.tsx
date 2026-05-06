import styles from '../ItemMetrics.module.css';

import { useItemMetrics } from '@/hooks/useItemMetrics';

import { TItem } from '@/types/item';

export function PotentialProfit({ item }: { item: TItem }) {
  const { potentialProfitValue, potentialProfitText, isNegative } =
    useItemMetrics(item);

  return (
    <div className={styles.price}>
      <div
        className={
          isNegative(potentialProfitValue)
            ? styles.negative
            : potentialProfitValue === 0
              ? ''
              : styles.positive
        }
      >
        {potentialProfitText}
      </div>
      <span className={styles.currency}>GP</span>
    </div>
  );
}
