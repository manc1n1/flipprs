import styles from './RecentTradesTable.module.css';

import { UTCTimestamp } from 'lightweight-charts';

import type { IColumn } from '@/components/Table';
import { PriceChange } from '@/components/ItemMetrics/PriceChange';
import { Volume } from '@/components/ItemMetrics/Volume';

import type { TTimeseries } from '@/types/chart';

function formatTimestamp(value: UTCTimestamp): React.ReactNode {
  const date = new Date(value * 1000);

  const ts = date.toLocaleString(navigator.language, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return <div className={styles.timestamp}>{ts}</div>;
}

function formatCompactNumber(value: number | null): string {
  if (value == null) return '-';

  return Intl.NumberFormat(navigator.language, {
    notation: 'compact',
    maximumFractionDigits: 3,
  }).format(value);
}

export const columns: IColumn<TTimeseries>[] = [
  {
    id: 'timestamp',
    header: 'Time',
    accessor: 'timestamp',
    sortable: false,
    render: formatTimestamp,
  },
  {
    id: 'avgHighPrice',
    header: 'Buy price',
    accessor: 'avgHighPrice',
    sortable: false,
    align: 'right',
    render: (value) => (
      <div className={styles.price}>
        <PriceChange
          value={value}
          formatter={formatCompactNumber}
        />
      </div>
    ),
  },
  {
    id: 'highPriceVolume',
    header: 'Buy volume',
    accessor: 'highPriceVolume',
    sortable: false,
    align: 'right',
    render: (value) => <Volume volume={value} />,
  },
  {
    id: 'avgLowPrice',
    header: 'Sell price',
    accessor: 'avgLowPrice',
    sortable: false,
    align: 'right',
    render: (value) => (
      <div className={styles.price}>
        <PriceChange
          value={value}
          formatter={formatCompactNumber}
        />
      </div>
    ),
  },
  {
    id: 'lowPriceVolume',
    header: 'Sell volume',
    accessor: 'lowPriceVolume',
    sortable: false,
    align: 'right',
    render: (value) => <Volume volume={value} />,
  },
];
