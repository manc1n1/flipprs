import styles from '../ItemMetrics.module.css';

import { formatCompactNumber } from '@/utils/formatters';
import { getItemMetrics } from '@/utils/metrics';

import type { TItem } from '@/types/item';

export function ROI({ item }: { item: TItem }) {
  const { marginValue, roiValue, roiText, isNegative } = getItemMetrics(item);

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
      {roiValue && roiValue > 0 ? '+' : ''}
      {roiValue === 0 ? roiText : formatCompactNumber(roiValue)}
      <span className={styles.percentSign}>%</span>
    </div>
  );
}
