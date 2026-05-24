import styles from './RecentTradesTable.module.css';

import type { IColumn } from '@/components/Table';
import { PriceChange } from '@/components/ItemMetrics/PriceChange';
import { Volume } from '@/components/ItemMetrics/Volume';

import { formatCompactNumber, formatTimestamp } from '@/utils/formatters';

import type { TTimeseries } from '@/types/chart';

export const columns: IColumn<TTimeseries>[] = [
  {
    id: 'timestamp',
    header: 'Time',
    accessor: 'timestamp',
    sortable: false,
    render: (value) => (
      <div className={styles.timestamp}>{formatTimestamp(value)}</div>
    ),
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
