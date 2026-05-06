import styles from '../ItemMetrics.module.css';

import { AnimatedNumber } from '@/components/AnimatedNumber';

import { usePriceChange } from '@/hooks/usePriceChange';

export function PriceChange({ value }: { value: number }) {
  const priceChange = usePriceChange(value);
  const className =
    priceChange === 'positive'
      ? styles.positive
      : priceChange === 'negative'
        ? styles.negative
        : '';

  return (
    <div className={styles.price}>
      <AnimatedNumber
        value={value}
        className={className}
      />
      <span className={styles.currency}>GP</span>
    </div>
  );
}
