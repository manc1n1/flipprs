/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './Table.module.css';

import { useCallback, useMemo, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';

import { useHaptics } from '@/hooks/useHaptics';

export interface IColumn<T> {
  header?: React.ReactNode;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface ISortConfig {
  columnIndex: number;
  direction: 'asc' | 'desc';
}

interface ITableProps<T> {
  columns: IColumn<T>[];
  data: T[];
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
}: ITableProps<T>) {
  const { selection } = useHaptics();
  const [sortConfig, setSortConfig] = useState<ISortConfig | null>(null);

  const getValue = useCallback(
    (row: T, accessor: keyof T | ((row: T) => unknown)): unknown => {
      return typeof accessor === 'function' ? accessor(row) : row[accessor];
    },
    [],
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { columnIndex, direction } = sortConfig;
    const accessor = columns[columnIndex].accessor;

    return [...data].sort((a, b) => {
      const aVal = getValue(a, accessor);
      const bVal = getValue(b, accessor);

      if (aVal == bVal) return 0;
      if (aVal == null) return direction === 'asc' ? -1 : 1;
      if (bVal == null) return direction === 'asc' ? 1 : -1;

      return aVal! > bVal!
        ? direction === 'asc'
          ? 1
          : -1
        : direction === 'asc'
          ? -1
          : 1;
    });
  }, [columns, data, getValue, sortConfig]);

  const handleSort = (colIndex: number) => {
    selection();

    if (columns[colIndex].sortable === false) return;

    if (!sortConfig || sortConfig.columnIndex !== colIndex) {
      setSortConfig({ columnIndex: colIndex, direction: 'asc' });
      return;
    }

    if (sortConfig.direction === 'asc') {
      setSortConfig({ columnIndex: colIndex, direction: 'desc' });
      return;
    }

    setSortConfig(null);
  };

  const getSortIndicator = (colIndex: number) => {
    if (!sortConfig || sortConfig.columnIndex !== colIndex)
      return (
        <div>
          &nbsp;
          <ArrowDownUp className={styles.sortIcon} />
        </div>
      );
    return sortConfig.direction === 'asc' ? (
      <div>
        &nbsp;
        <ArrowUpNarrowWide className={styles.sortIcon} />
      </div>
    ) : (
      <div>
        &nbsp;
        <ArrowDownWideNarrow className={styles.sortIcon} />
      </div>
    );
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.scrollWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              {columns.map((col, colIndex) => (
                <th
                  className={styles.th}
                  key={`${String(col.accessor)}-${colIndex}`}
                  onClick={() => handleSort(colIndex)}
                >
                  <div className={styles.label}>
                    {col.header}
                    {col.sortable !== false && getSortIndicator(colIndex)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <LayoutGroup>
            <motion.tbody layout>
              {sortedData.map((row, rowIndex) => (
                <motion.tr
                  layout
                  layoutId={`row-${row.id}`}
                  className={styles.tableBodyRow}
                  key={row.id}
                  transition={{
                    layout: {
                      type: 'tween',
                      duration: 0.8,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                  }}
                >
                  {columns.map((col, colIndex) => {
                    const value = getValue(row, col.accessor);
                    return (
                      <td
                        className={styles.td}
                        key={`${rowIndex}-${colIndex}`}
                      >
                        {col.render
                          ? col.render(value, row)
                          : (value as React.ReactNode)}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </motion.tbody>
          </LayoutGroup>
        </table>
      </div>
    </div>
  );
}
