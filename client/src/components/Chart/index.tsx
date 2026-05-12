import styles from './Chart.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CircleAlert } from 'lucide-react';
import {
  AreaData,
  AreaSeries,
  ColorType,
  createChart,
  CrosshairMode,
  HistogramData,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LastPriceAnimationMode,
  LineStyle,
  MouseEventParams,
  TickMarkType,
  Time,
  UTCTimestamp,
  WhitespaceData,
} from 'lightweight-charts';
import { motion } from 'framer-motion';

import { RANGE_TO_SECONDS } from '@/constants';

import type { TTIME_RANGE_KEY } from '@/types/chart';

export interface IChartProps {
  currentPrice: number;
  range: TTIME_RANGE_KEY;
  showAdvancedChart: boolean;
  data: AreaData<UTCTimestamp>[];
  sellData: AreaData<UTCTimestamp>[];
  highVolume: HistogramData<UTCTimestamp>[];
  lowVolume: HistogramData<UTCTimestamp>[];
  totalVolume: HistogramData<UTCTimestamp>[];
  historyData: AreaData<UTCTimestamp>[];
  historyVolume: HistogramData<UTCTimestamp>[];
}

function getChartXAxis(range: Exclude<TTIME_RANGE_KEY, 'MAX'>): number {
  const seconds = RANGE_TO_SECONDS[range];
  const now = Math.floor(Date.now() / 1000);

  return now - seconds;
}

function timestampFormatter(timestamp: UTCTimestamp) {
  const date = new Date(timestamp * 1000);
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();

  return date.toLocaleString(navigator.language, {
    year: isCurrentYear ? undefined : 'numeric',
    weekday: isCurrentYear ? 'short' : undefined,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatNumber(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return '-';

  return value.toLocaleString();
}

function getSeriesValue<T extends Time>(
  data: AreaData<T> | HistogramData<T> | WhitespaceData<T> | undefined,
) {
  if (!data || !('value' in data)) return undefined;

  return data.value;
}

export const Chart = ({
  currentPrice,
  range,
  showAdvancedChart,
  data,
  sellData,
  highVolume,
  lowVolume,
  totalVolume,
  historyData,
  historyVolume,
}: IChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const seriesRef = useRef<ISeriesApi<
    'Area',
    Time,
    AreaData<Time> | WhitespaceData<Time>
  > | null>(null);

  const sellSeriesRef =
    useRef<ISeriesApi<'Area', Time, AreaData<Time> | WhitespaceData<Time>>>(
      null,
    );

  const hiVolRef =
    useRef<
      ISeriesApi<'Histogram', Time, HistogramData<Time> | WhitespaceData<Time>>
    >(null);

  const lowVolRef =
    useRef<
      ISeriesApi<'Histogram', Time, HistogramData<Time> | WhitespaceData<Time>>
    >(null);

  const totalVolRef =
    useRef<
      ISeriesApi<'Histogram', Time, HistogramData<Time> | WhitespaceData<Time>>
    >(null);

  const itemPriceLineRef = useRef<ReturnType<
    ISeriesApi<'Area'>['createPriceLine']
  > | null>(null);

  const timeseries = useMemo(() => {
    if (!data?.length || range === 'MAX') return [];

    const from = getChartXAxis(range);

    return data.filter((ts) => ts.time >= from);
  }, [data, range]);

  const historyTimeseries = useMemo(() => {
    if (!historyData?.length) return [];

    return historyData.map((ts) => ({
      ...ts,
      time: Math.floor(ts.time / 1000) as UTCTimestamp,
    }));
  }, [historyData]);

  const historyVolumeSeries = useMemo(() => {
    if (!historyVolume?.length) return [];

    return historyVolume.map((ts) => ({
      ...ts,
      time: Math.floor(ts.time / 1000) as UTCTimestamp,
    }));
  }, [historyVolume]);

  const activeSeries = useMemo(
    () => (range === 'MAX' ? historyTimeseries : timeseries),
    [historyTimeseries, range, timeseries],
  );

  const hasData = activeSeries.length > 0;
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (!hasData) {
      setShakeKey((k) => k + 1);
    }
  }, [hasData]);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const container = containerRef.current;
    const styles = getComputedStyle(container);

    const chart = createChart(container, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: styles.getPropertyValue('--bg-color').trim(),
        },
        textColor: styles.getPropertyValue('--text-color').trim(),
        fontFamily: 'runescape-bold',
        fontSize: 12,
      },
      localization: {
        locale: navigator.language,
        timeFormatter: timestampFormatter,
      },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.15, bottom: 0.15 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        tickMarkFormatter: (
          timestamp: UTCTimestamp,
          tickMarkType: TickMarkType,
          locale: string = navigator.language,
        ) => {
          const date = new Date(timestamp * 1000);
          const isCurrentYear = date.getFullYear() === new Date().getFullYear();

          if (isCurrentYear) {
            switch (tickMarkType) {
              case TickMarkType.Month:
                return date.toLocaleString(locale, { month: 'short' });
              case TickMarkType.DayOfMonth:
                return date.getDate().toString();
              case TickMarkType.Time:
              case TickMarkType.TimeWithSeconds:
                return date.toLocaleTimeString(locale, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });
              default:
                return '';
            }
          }

          switch (tickMarkType) {
            case TickMarkType.Year:
              return date.getFullYear().toString();
            case TickMarkType.Month:
              return date.toLocaleString(locale, { month: 'short' });
            case TickMarkType.DayOfMonth:
              return date.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
              });
            default:
              return '';
          }
        },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: LineStyle.LargeDashed,
          color: styles.getPropertyValue('--crosshair').trim(),
          labelBackgroundColor: styles.getPropertyValue('--label-color').trim(),
        },
        horzLine: {
          visible: false,
          labelVisible: false,
          style: LineStyle.LargeDashed,
          color: styles.getPropertyValue('--crosshair').trim(),
          labelBackgroundColor: styles.getPropertyValue('--label-color').trim(),
        },
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        vertTouchDrag: false,
        horzTouchDrag: false,
      },
      handleScale: {
        mouseWheel: false,
        axisPressedMouseMove: { time: false, price: false },
        axisDoubleClickReset: { time: false, price: false },
        pinch: false,
      },
      width: container.clientWidth,
      height: 300,
    });

    const series = chart.addSeries(AreaSeries, {
      lineWidth: 1,
      lastValueVisible: false,
      priceLineVisible: false,
      lastPriceAnimation: LastPriceAnimationMode.Continuous,
      priceFormat: { type: 'volume', precision: 2, minMove: 0.1 },
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderWidth: 2,
    });

    const sellSeries = chart.addSeries(AreaSeries, {
      lineWidth: 1,
      lastValueVisible: false,
      priceLineVisible: false,
      lastPriceAnimation: LastPriceAnimationMode.Continuous,
      priceFormat: { type: 'volume', precision: 2, minMove: 0.1 },
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderWidth: 2,
    });

    const hiVolSeries = chart.addSeries(HistogramSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'high-volume',
    });

    const lowVolSeries = chart.addSeries(HistogramSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'low-volume',
    });

    const totalVolSeries = chart.addSeries(HistogramSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'total-volume',
    });

    hiVolSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.9,
        bottom: 0.05,
      },
    });

    lowVolSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.95,
        bottom: 0,
      },
    });

    totalVolSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    seriesRef.current = series;
    sellSeriesRef.current = sellSeries;
    hiVolRef.current = hiVolSeries;
    lowVolRef.current = lowVolSeries;
    totalVolRef.current = totalVolSeries;

    return () => {
      chart.remove();

      chartRef.current = null;
      seriesRef.current = null;
      sellSeriesRef.current = null;
      hiVolRef.current = null;
      lowVolRef.current = null;
      totalVolRef.current = null;
      itemPriceLineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const chart = chartRef.current;
    const series = seriesRef.current;
    const sellSeries = sellSeriesRef.current;
    const hiVolSeries = hiVolRef.current;
    const lowVolSeries = lowVolRef.current;
    const totalVolSeries = totalVolRef.current;

    if (!container || !chart || !series) return;
    if (!activeSeries.length) return;

    series.setData(activeSeries);

    if (totalVolSeries) {
      if (range === 'MAX') {
        totalVolSeries.setData(historyVolumeSeries);
      } else if (!showAdvancedChart) {
        const from = getChartXAxis(range);

        const filteredTotalVolume = totalVolume.filter((ts) => ts.time >= from);

        totalVolSeries.setData(filteredTotalVolume);
      } else {
        totalVolSeries.setData([]);
      }
    }

    if (sellSeries && hiVolSeries && lowVolSeries) {
      if (showAdvancedChart && range !== 'MAX') {
        const from = getChartXAxis(range);

        const filteredSellData = sellData.filter((ts) => ts.time >= from);
        const filteredHighVolume = highVolume.filter((ts) => ts.time >= from);
        const filteredLowVolume = lowVolume.filter((ts) => ts.time >= from);

        sellSeries.setData(filteredSellData);
        hiVolSeries.setData(filteredHighVolume);
        lowVolSeries.setData(filteredLowVolume);
      } else {
        sellSeries.setData([]);
        hiVolSeries.setData([]);
        lowVolSeries.setData([]);
      }
    }

    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const styles = getComputedStyle(container);

      const oldestBuy = activeSeries[0].value;

      const trend =
        currentPrice > oldestBuy
          ? 'bull'
          : currentPrice < oldestBuy
            ? 'bear'
            : 'neutral';

      const priceLineColor =
        trend === 'bull'
          ? '--line-green'
          : trend === 'bear'
            ? '--line-red'
            : '--line-color';

      const buyLineColor =
        showAdvancedChart && range !== 'MAX'
          ? '--line-green'
          : trend === 'bull'
            ? '--line-green'
            : trend === 'bear'
              ? '--line-red'
              : '--line-color';

      const buyTopColor =
        showAdvancedChart && range !== 'MAX'
          ? '--bottom'
          : trend === 'bull'
            ? '--top-green'
            : trend === 'bear'
              ? '--top-red'
              : '--top';

      const buyBottomColor =
        showAdvancedChart && range !== 'MAX'
          ? '--bottom'
          : trend === 'bull'
            ? '--bottom-green'
            : trend === 'bear'
              ? '--bottom-red'
              : '--bottom';

      chart.applyOptions({
        layout: {
          background: {
            type: ColorType.Solid,
            color: styles.getPropertyValue('--bg-color').trim(),
          },
          textColor: styles.getPropertyValue('--text-color').trim(),
        },
        crosshair: {
          vertLine: {
            color: styles.getPropertyValue('--crosshair').trim(),
            labelBackgroundColor: styles
              .getPropertyValue('--label-color')
              .trim(),
          },
          horzLine: {
            color: styles.getPropertyValue('--crosshair').trim(),
            labelBackgroundColor: styles
              .getPropertyValue('--label-color')
              .trim(),
          },
        },
      });

      series.applyOptions({
        lineColor: styles.getPropertyValue(buyLineColor).trim(),
        topColor: styles.getPropertyValue(buyTopColor).trim(),
        bottomColor: styles.getPropertyValue(buyBottomColor).trim(),
        crosshairMarkerBackgroundColor: styles
          .getPropertyValue(buyLineColor)
          .trim(),
        crosshairMarkerBorderColor: styles
          .getPropertyValue(showAdvancedChart ? '--top-green' : buyTopColor)
          .trim(),
      });

      if (sellSeries) {
        sellSeries.applyOptions({
          lineColor: styles.getPropertyValue('--line-red').trim(),
          topColor: styles.getPropertyValue('--bottom').trim(),
          bottomColor: styles.getPropertyValue('--bottom').trim(),
          crosshairMarkerBackgroundColor: styles
            .getPropertyValue('--line-red')
            .trim(),
          crosshairMarkerBorderColor: styles
            .getPropertyValue('--top-red')
            .trim(),
        });
      }

      if (hiVolSeries) {
        hiVolSeries.applyOptions({
          color: styles.getPropertyValue('--line-green').trim(),
        });
      }

      if (lowVolSeries) {
        lowVolSeries.applyOptions({
          color: styles.getPropertyValue('--line-red').trim(),
        });
      }

      if (totalVolSeries) {
        totalVolSeries.applyOptions({
          color: styles.getPropertyValue(priceLineColor).trim(),
        });
      }

      if (itemPriceLineRef.current) {
        series.removePriceLine(itemPriceLineRef.current);
        itemPriceLineRef.current = null;
      }

      itemPriceLineRef.current = series.createPriceLine({
        price: currentPrice,
        color: styles.getPropertyValue(priceLineColor).trim(),
      });
    };

    themeMedia.addEventListener('change', applyTheme);
    applyTheme();

    if (range === 'MAX') {
      chart.timeScale().applyOptions({
        minBarSpacing: 0.1,
      });
    }

    chart.timeScale().fitContent();
    chart.timeScale().applyOptions({
      rightOffset: 5,
      fixLeftEdge: true,
    });

    return () => {
      if (itemPriceLineRef.current) {
        series.removePriceLine(itemPriceLineRef.current);
        itemPriceLineRef.current = null;
      }

      themeMedia.removeEventListener('change', applyTheme);
    };
  }, [
    activeSeries,
    currentPrice,
    highVolume,
    historyVolumeSeries,
    lowVolume,
    range,
    sellData,
    showAdvancedChart,
    totalVolume,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    const chart = chartRef.current;
    const tooltip = tooltipRef.current;

    const buySeries = seriesRef.current;
    const sellSeries = sellSeriesRef.current;
    const hiVolSeries = hiVolRef.current;
    const lowVolSeries = lowVolRef.current;
    const totalVolSeries = totalVolRef.current;

    if (!container || !chart || !tooltip || !buySeries) return;

    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      if (
        !param.time ||
        !param.point ||
        param.point.x < 0 ||
        param.point.y < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y > container.clientHeight
      ) {
        tooltip.style.display = 'none';
        return;
      }

      const buyPoint = param.seriesData.get(buySeries);
      const sellPoint = sellSeries
        ? param.seriesData.get(sellSeries)
        : undefined;
      const highVolumePoint = hiVolSeries
        ? param.seriesData.get(hiVolSeries)
        : undefined;
      const lowVolumePoint = lowVolSeries
        ? param.seriesData.get(lowVolSeries)
        : undefined;
      const totalVolumePoint = totalVolSeries
        ? param.seriesData.get(totalVolSeries)
        : undefined;

      const buyPrice = getSeriesValue(buyPoint);
      const sellPrice = getSeriesValue(sellPoint);
      const buyVolume = getSeriesValue(highVolumePoint);
      const sellVolume = getSeriesValue(lowVolumePoint);
      const totalVol = getSeriesValue(totalVolumePoint);

      const time = timestampFormatter(param.time as UTCTimestamp);

      tooltip.innerHTML = `
      <div class="${styles.tooltipDate}">${time}</div>

      <div class="${styles.tooltipRow}">
        <span>
          ${showAdvancedChart && range !== 'MAX' ? `Buy price` : `Price`}
        </span>
        <strong>${formatNumber(buyPrice)}</strong>
      </div>

      ${
        showAdvancedChart && range !== 'MAX'
          ? `
            <div class="${styles.tooltipRow}">
              <span>Sell price</span>
              <strong>${formatNumber(sellPrice)}</strong>
            </div>

            <div class="${styles.tooltipRow}">
              <span>Buy volume</span>
              <strong>${formatNumber(buyVolume ?? 0)}</strong>
            </div>

            <div class="${styles.tooltipRow}">
              <span>Sell volume</span>
              <strong>${formatNumber(Math.abs(sellVolume ?? 0))}</strong>
            </div>
          `
          : `
            <div class="${styles.tooltipRow}">
              <span>Volume</span>
              <strong>${formatNumber(totalVol)}</strong>
            </div>
          `
      }
    `;

      tooltip.style.display = 'block';

      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;

      const margin = 12;
      const edgePadding = 36;

      let left = param.point.x + margin;
      let top = param.point.y + margin;

      if (left + tooltipWidth > container.clientWidth - edgePadding) {
        left = param.point.x - tooltipWidth - margin;
      }

      if (top + tooltipHeight > container.clientHeight - edgePadding) {
        top = param.point.y - tooltipHeight - margin;
      }

      left = Math.max(edgePadding, left);
      top = Math.max(edgePadding, top);

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [range, showAdvancedChart]);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const chart = chartRef.current;

      if (!chart || !container) return;

      chart.resize(container.clientWidth, 300);
      chart.timeScale().fitContent();
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!hasData) {
    return (
      <motion.div
        key={shakeKey}
        className={styles.emptyChart}
        initial={{ x: 0, scale: 1 }}
        animate={{
          x: [0, -12, 10, -8, 6, -4, 2, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          x: { type: 'tween', duration: 0.55, ease: 'easeOut' },
          scale: { type: 'tween', duration: 0.35, ease: 'easeOut' },
        }}
      >
        <CircleAlert size={20} />
        No data for this time period
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles.chart}
    >
      <div
        ref={tooltipRef}
        className={styles.tooltip}
      />
    </div>
  );
};
