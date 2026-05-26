import styles from '../ItemMetrics.module.css';

import { getItemMetrics } from '@/utils/metrics';

import type { TItem } from '@/types/item';

export function ROI({ item }: { item: TItem }) {
  const { marginValue, roiText, isNegative } = getItemMetrics(item);

  return (
    <div
      className={
        roiText === '-'
          ? styles.bold
          : isNegative(marginValue)
            ? styles.negative
            : marginValue === 0
              ? ''
              : styles.positive
      }
    >
      {roiText}
      <span className={styles.percentSign}>%</span>
    </div>
  );
}
