import styles from './BuySellPressureBar.module.css';

import { Info } from 'lucide-react';

import { formatCompactNumber } from '@/utils/formatters';

import type { TTimeseries } from '@/types/chart';

export default function BuySellPressureBar({
  timeseries,
}: {
  timeseries?: TTimeseries[];
}) {
  const buyVolume =
    timeseries?.reduce((sum, ts) => sum + (ts.highPriceVolume ?? 0), 0) ?? 0;
  const sellVolume =
    timeseries?.reduce((sum, ts) => sum + (ts.lowPriceVolume ?? 0), 0) ?? 0;
  const totalVolume = buyVolume + sellVolume;
  const buyPercent = totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 50;
  const sellPercent = totalVolume > 0 ? 100 - buyPercent : 50;
  const ratio = sellVolume > 0 ? buyVolume / sellVolume : null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={styles.titleText}>Buy / Sell Pressure</span>
        <div className={styles.infoWrapper}>
          <Info
            className={styles.infoIcon}
            size={16}
          />

          <div
            role='tooltip'
            className={styles.tooltip}
          >
            <span className={styles.tooltipTitle}>Pressure</span>:
            <div>Buy = high-price volume</div>
            <div>Sell = low-price volume</div>
            <br />
            <span className={styles.tooltipTitle}>Ratio</span>:
            <div>&gt; 1 = stronger buying</div>
            <div className={styles.bullet}>- Stronger demand</div>
            <div>&lt; 1 = stronger selling</div>
            <div className={styles.bullet}>- More supply than demand</div>
          </div>
        </div>
      </div>

      <div className={styles.barRow}>
        <div className={styles.buyPercent}>{Math.round(buyPercent)}%</div>

        <div className={styles.bar}>
          <div
            className={styles.buyBar}
            style={{ width: `${buyPercent}%` }}
          />

          <div
            className={styles.sellBar}
            style={{ width: `${sellPercent}%` }}
          />

          <div
            className={styles.marker}
            style={{ left: `${buyPercent}%` }}
          />
        </div>

        <div className={styles.sellPercent}>{Math.round(sellPercent)}%</div>
      </div>

      <div className={styles.stats}>
        <div>
          <div className={styles.label}>Buy vol</div>
          <div className={buyVolume === 0 ? styles.bold : styles.buyValue}>
            {buyVolume === 0 ? '-' : formatCompactNumber(buyVolume, 2)}
          </div>
        </div>

        <div>
          <div className={styles.label}>Ratio</div>
          <div className={styles.ratio}>
            {ratio ? (
              <>
                <span className={styles.buyValue}>
                  {formatCompactNumber(ratio, 2)}
                </span>
                <span>:</span>
                <span className={styles.sellValue}>1</span>
              </>
            ) : (
              <span className={styles.bold}>-</span>
            )}
          </div>
        </div>

        <div>
          <div className={styles.label}>Sell vol</div>
          <div className={sellVolume === 0 ? styles.bold : styles.sellValue}>
            {sellVolume === 0 ? '-' : formatCompactNumber(sellVolume, 2)}
          </div>
        </div>
      </div>
    </div>
  );
}
