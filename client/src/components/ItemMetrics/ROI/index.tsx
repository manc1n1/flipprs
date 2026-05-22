import styles from '../ItemMetrics.module.css';

import { useItemMetrics } from '@/hooks/useItemMetrics';

import type { TItem } from '@/types/item';

export function ROI({ item }: { item: TItem }) {
  const { marginValue, roi, isNegative } = useItemMetrics(item);

  return (
    <div
      className={
        roi === '-%'
          ? ''
          : isNegative(marginValue)
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
