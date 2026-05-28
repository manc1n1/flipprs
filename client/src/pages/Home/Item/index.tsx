import styles from './Item.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AreaData, HistogramData, UTCTimestamp } from 'lightweight-charts';
import { AnimatePresence, motion } from 'framer-motion';
import { TrendingUp, TrendingUpDown } from 'lucide-react';

import ItemHeader from '@/components/ItemHeader';
import { Chart } from '@/components/Chart';
import ItemDetails from '@/components/ItemDetails';
import BuySellPressureBar from '@/components/BuySellPressureBar';
import RecentTradesTable from '@/components/RecentTradesTable';

import { useItemDetailQuery } from '@/hooks/useItemDetailQuery';
import { useTimeseriesQuery } from '@/hooks/useTimeseriesQuery';
import { useHistoryTimeseriesQuery } from '@/hooks/useHistoryTimeseriesQuery';
import { useFavicon } from '@/hooks/useFavicon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { formatCompactNumber } from '@/utils/formatters';
import { buildIconUrl } from '@/utils/buildIconUrl';

import type { TAChart, TTIME_RANGE_KEY } from '@/types/chart';
import type { TItem, TPriceChangeSummary } from '@/types/item';

import { RANGE_TO_SECONDS, RANGE_TO_STEP, TIME_RANGE_ORDER } from '@/constants';

function getMostRecentItemTrade(item: TItem): {
  price: number;
  timestamp: number;
  type: 'high' | 'low';
} {
  return item.highTime >= item.lowTime
    ? { price: item.high, timestamp: item.highTime, type: 'high' }
    : { price: item.low, timestamp: item.lowTime, type: 'low' };
}

function getRangeFilteredSeries<T>(
  series: T[],
  range: TTIME_RANGE_KEY,
  getTime: (ts: T) => number,
): T[] {
  if (range === 'MAX') return series;

  const seconds = RANGE_TO_SECONDS[range];
  const now = Math.floor(Date.now() / 1000);
  const from = now - seconds;

  return series.filter((ts) => getTime(ts) >= from);
}

function getPriceChangeSummary(
  item: TItem,
  series: AreaData<UTCTimestamp>[],
): TPriceChangeSummary | null {
  if (!series.length) return null;

  const oldestPrice = series[0].value;
  const latestTrade = getMostRecentItemTrade(item);

  if (oldestPrice === 0) return null;

  const valueChange = latestTrade.price - oldestPrice;
  const percentChange = (valueChange / oldestPrice) * 100;

  return {
    valueChange,
    percentChange,
    recentPrice: latestTrade.price,
    latestTrade: latestTrade.timestamp,
    oldestPrice,
  };
}

const Item = ({ itemId }: { itemId: number }) => {
  const { item } = useItemDetailQuery(itemId);
  const [range, setRange] = useState<TTIME_RANGE_KEY>('1D');
  const [showAdvancedChart, setShowAdvancedChart] = useState(false);
  const timestep = range === 'MAX' ? null : RANGE_TO_STEP[range];
  const { timeseries, loading: loadingTs } = useTimeseriesQuery(
    timestep,
    itemId,
  );
  const { timeseries: recentTradesTimeseries } = useTimeseriesQuery(
    RANGE_TO_STEP['1D'],
    itemId,
  );
  const showHistory = range === 'MAX' && !!itemId;
  const historyCacheRef = useRef<Record<number, AreaData<UTCTimestamp>[]>>({});
  const { data: historyTimeseries, isLoading: loadingHistoryTs } =
    useHistoryTimeseriesQuery(showHistory, String(itemId));
  const previousPriceChangeDisplayRef = useRef<{
    range: TTIME_RANGE_KEY;
    summary: TPriceChangeSummary;
  } | null>(null);

  function buildAreaData<T>(
    data: T[] | null | undefined,
    getTime: (ts: T) => UTCTimestamp,
    getValue: (ts: T) => number | null | undefined,
  ): AreaData<UTCTimestamp>[] {
    return (data ?? []).reduce<AreaData<UTCTimestamp>[]>((acc, ts) => {
      const value = getValue(ts);

      if (value != null) {
        acc.push({
          time: getTime(ts),
          value,
        });
      }

      return acc;
    }, []);
  }

  const data = useMemo(
    () =>
      buildAreaData(
        timeseries,
        (ts) => ts.timestamp,
        (ts) =>
          showAdvancedChart
            ? ts.avgHighPrice
            : (ts.avgHighPrice ?? ts.avgLowPrice),
      ),
    [showAdvancedChart, timeseries],
  );

  const sellData = useMemo(
    () =>
      buildAreaData(
        timeseries,
        (ts) => ts.timestamp,
        (ts) => ts.avgLowPrice,
      ),
    [timeseries],
  );

  const historyData = useMemo(
    () =>
      buildAreaData(
        historyTimeseries,
        (ts) => ts.timestamp,
        (ts) => ts.price,
      ),
    [historyTimeseries],
  );

  const highPriceVolumeData = useMemo<HistogramData<UTCTimestamp>[]>(
    () =>
      (timeseries ?? []).reduce<HistogramData<UTCTimestamp>[]>((acc, ts) => {
        if (ts.highPriceVolume > 0) {
          acc.push({
            time: ts.timestamp,
            value: ts.highPriceVolume,
          });
        }

        return acc;
      }, []),
    [timeseries],
  );

  const lowPriceVolumeData = useMemo<HistogramData<UTCTimestamp>[]>(
    () =>
      (timeseries ?? []).reduce<HistogramData<UTCTimestamp>[]>((acc, ts) => {
        if (ts.lowPriceVolume > 0) {
          acc.push({
            time: ts.timestamp,
            value: -ts.lowPriceVolume,
          });
        }

        return acc;
      }, []),
    [timeseries],
  );

  const totalVolumeData = useMemo<HistogramData<UTCTimestamp>[]>(
    () =>
      (timeseries ?? []).map((ts) => ({
        time: ts.timestamp,
        value: (ts.highPriceVolume ?? 0) + (ts.lowPriceVolume ?? 0),
      })),
    [timeseries],
  );

  const historyVolumeData = useMemo<HistogramData<UTCTimestamp>[]>(
    () =>
      (historyTimeseries ?? []).map((ts) => ({
        time: ts.timestamp,
        value: ts.volume ?? 0,
      })),
    [historyTimeseries],
  );

  useEffect(() => {
    historyCacheRef.current = {};
  }, [itemId]);

  useEffect(() => {
    if (historyData.length) {
      historyCacheRef.current[itemId] = historyData;
    }
  }, [historyData, itemId]);

  const cachedHistory = historyCacheRef.current[itemId] ?? [];

  const historyToShow = historyData.length > 0 ? historyData : cachedHistory;

  const chartData = showHistory ? historyToShow : data;
  const displayed: TAChart | null =
    !showHistory && loadingTs
      ? null
      : showHistory && loadingHistoryTs && !historyToShow.length
        ? null
        : { range, data: chartData };

  const rawPriceChangeSummary = useMemo(() => {
    if (!item) return null;

    const rangeSeries = getRangeFilteredSeries(chartData, range, (ts) =>
      Number(ts.time),
    );

    return getPriceChangeSummary(item, rangeSeries);
  }, [chartData, item, range]);

  useEffect(() => {
    if (rawPriceChangeSummary) {
      previousPriceChangeDisplayRef.current = {
        range,
        summary: rawPriceChangeSummary,
      };
    }
  }, [range, rawPriceChangeSummary]);

  const isPriceSummarySettling = showHistory ? loadingHistoryTs : loadingTs;

  const priceChangeDisplay = rawPriceChangeSummary
    ? {
        range,
        summary: rawPriceChangeSummary,
      }
    : isPriceSummarySettling
      ? previousPriceChangeDisplayRef.current
      : null;

  const handleRangeClick = (k: TTIME_RANGE_KEY) => {
    if (loadingTs || loadingHistoryTs) return;

    setRange(k);
  };

  const recentTrades = useMemo(() => {
    if (!recentTradesTimeseries) return [];

    const now = Math.floor(Date.now() / 1000);
    const last24Hours = now - 60 * 60 * 24;

    return recentTradesTimeseries
      .filter((ts) => ts.timestamp >= last24Hours)
      .slice(-10)
      .reverse();
  }, [recentTradesTimeseries]);

  const pressureTimeseries = useMemo(() => {
    if (showHistory) return [];

    return getRangeFilteredSeries(timeseries ?? [], range, (ts) =>
      Number(ts.timestamp),
    );
  }, [range, showHistory, timeseries]);

  useFavicon(buildIconUrl(item?.icon));

  useDocumentTitle(
    item?.name
      ? `${item.name} - ${formatCompactNumber(getMostRecentItemTrade(item).price)} gp | flipp.rs`
      : 'flipp.rs',
  );

  return (
    <>
      {item && (
        <div className={styles.itemContainer}>
          <ItemHeader
            item={item}
            range={range}
            currentPrice={getMostRecentItemTrade(item).price}
            latestTrade={getMostRecentItemTrade(item).timestamp}
            priceChangeSummary={priceChangeDisplay?.summary ?? null}
          />
          <div
            className={styles.chartStage}
            aria-live='polite'
          >
            <AnimatePresence
              initial={false}
              mode='wait'
            >
              {displayed && (
                <motion.div
                  key={`${itemId}-${displayed.range}-${showAdvancedChart ? 'advanced' : 'basic'}`}
                  className={styles.chartLayer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Chart
                    currentPrice={getMostRecentItemTrade(item).price}
                    range={displayed.range}
                    showAdvancedChart={showAdvancedChart}
                    data={displayed.data}
                    sellData={sellData}
                    highVolume={highPriceVolumeData}
                    lowVolume={lowPriceVolumeData}
                    totalVolume={totalVolumeData}
                    historyData={historyToShow}
                    historyVolume={historyVolumeData}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            role='radiogroup'
            aria-label=''
            className={styles.timestepContainer}
          >
            {TIME_RANGE_ORDER.map((k) => {
              const active = k === range;
              return (
                <motion.button
                  key={k}
                  type='button'
                  role='radio'
                  tabIndex={0}
                  aria-label={k}
                  aria-checked={active}
                  onClick={() => handleRangeClick(k)}
                  disabled={loadingTs || loadingHistoryTs}
                  aria-disabled={loadingTs || loadingHistoryTs}
                  className={`${styles.rangeButton} ${
                    active ? styles.activeRange : ''
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`${active ? '' : styles.rangeTitle}`}>
                    {k}
                  </span>
                </motion.button>
              );
            })}
            <motion.button
              type='button'
              onClick={() => {
                setShowAdvancedChart((prev) => !prev);
              }}
              whileTap={{ scale: 0.95 }}
              className={`${styles.rangeButton} ${styles.chartTypeToggle}`}
              aria-label='Toggle chart type'
            >
              <motion.div
                animate={{
                  x: showAdvancedChart ? '100%' : '0%',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={styles.toggleSwitch}
              />

              <div className={styles.iconWrapper}>
                <div className={styles.iconSlot}>
                  <TrendingUp
                    size={18}
                    className={
                      !showAdvancedChart ? styles.active : styles.inactive
                    }
                  />
                </div>

                <div className={styles.iconSlot}>
                  <TrendingUpDown
                    size={18}
                    className={
                      showAdvancedChart ? styles.active : styles.inactive
                    }
                  />
                </div>
              </div>
            </motion.button>
          </div>
          {!showHistory && (
            <BuySellPressureBar timeseries={pressureTimeseries} />
          )}
          <ItemDetails item={item} />
          {recentTrades.length > 0 && (
            <>
              <div className={styles.sectionTitle}>Recent trades</div>
              <RecentTradesTable timeseries={recentTrades} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Item;
