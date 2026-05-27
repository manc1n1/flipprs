import styles from './Chip.module.css';

import { formatCompactNumber } from '@/utils/formatters';

export function Chip({ value }: { value: number }) {
  const variant =
    value > 0 ? styles.positive : value < 0 ? styles.negative : styles.neutral;

  return (
    <div className={`${styles.chip} ${variant}`}>
      <span className={styles.chipText}>
        {value > 0 ? '+' : ''}
        {formatCompactNumber(value, 2)}%
      </span>
    </div>
  );
}
