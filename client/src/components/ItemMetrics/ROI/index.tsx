import styles from '../ItemMetrics.module.css';

import { useItemMetrics } from '@/hooks/useItemMetrics';

import { TItem } from '@/types/item';

export function ROI({ item }: { item: TItem }) {
  const { marginValue, roi, isNegative } = useItemMetrics(item);

  return (
    <div
      className={
        isNegative(marginValue)
          ? styles.negative
          : marginValue === 0
          ? ''
          : styles.positive
      }
    >
      {roi}
    </div>
  );
}
