import styles from '../ItemMetrics.module.css';

import { useTax } from '@/hooks/useTax';

export function Tax({ price }: { price: number }) {
  const { formattedTax } = useTax(price);

  return (
    <div className={styles.price}>
      <div className={styles.negative}>{formattedTax}</div>
      <span className={styles.currency}>GP</span>
    </div>
  );
}
