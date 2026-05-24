import styles from '../ItemMetrics.module.css';

import { AnimatedNumber } from '@/components/AnimatedNumber';

import { usePriceChange } from '@/hooks/usePriceChange';

export function PriceChange({
  value,
  formatter,
}: {
  value: number;
  formatter?: (value: number) => string;
}) {
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
        formatter={formatter}
      />
      <span className={styles.currency}>GP</span>
    </div>
  );
}
