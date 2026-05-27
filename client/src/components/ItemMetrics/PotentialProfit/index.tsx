import styles from '../ItemMetrics.module.css';

import { getItemMetrics } from '@/utils/metrics';

import type { TItem } from '@/types/item';

export function PotentialProfit({ item }: { item: TItem }) {
  const { potentialProfitValue, potentialProfitText, isNegative } =
    getItemMetrics(item);

  return (
    <div className={styles.price}>
      <div
        className={
          isNegative(potentialProfitValue)
            ? styles.negative
            : potentialProfitText === '-'
              ? styles.bold
              : potentialProfitValue === 0
                ? ''
                : styles.positive
        }
      >
        {potentialProfitValue > 0 ? '+' : ''}
        {potentialProfitText}
      </div>
      <span className={styles.currency}>GP</span>
    </div>
  );
}
