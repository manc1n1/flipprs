import styles from './BuySellPressureBar.module.css';

import { useState } from 'react';
import { Info } from 'lucide-react';

import { formatCompactNumber } from '@/utils/formatters';

import type { TTimeseries } from '@/types/chart';

export default function BuySellPressureBar({
  timeseries,
}: {
  timeseries?: TTimeseries[];
}) {
  const [hoverState, setHoverState] = useState<'buy' | 'sell' | null>(null);

  const buyVolume =
    timeseries?.reduce((sum, ts) => sum + (ts.highPriceVolume ?? 0), 0) ?? 0;
  const sellVolume =
    timeseries?.reduce((sum, ts) => sum + (ts.lowPriceVolume ?? 0), 0) ?? 0;
  const totalVolume = buyVolume + sellVolume;
  const buyPercent = totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 50;
  const sellPercent = totalVolume > 0 ? 100 - buyPercent : 50;
  const ratio = sellVolume > 0 ? buyVolume / sellVolume : null;

  const hoveredVolume = hoverState === 'buy' ? buyVolume : sellVolume;
  const tooltipLeft =
    hoverState === 'buy' ? buyPercent / 2 : buyPercent + sellPercent / 2;

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
            className={styles.infoTooltip}
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
        <div
          className={`${styles.buyPercent} ${
            hoverState === 'sell' ? styles.dimmed : ''
          }`}
          onMouseEnter={() => setHoverState('buy')}
          onMouseLeave={() => setHoverState(null)}
        >
          {Math.round(buyPercent)}%
        </div>

        <div className={styles.bar}>
          {hoverState && (
            <div
              className={styles.volumeTooltip}
              style={{ left: `${tooltipLeft}%` }}
            >
              <div className={styles.volumeTooltipText}>
                {hoveredVolume.toLocaleString()}
              </div>
            </div>
          )}

          <div
            className={`${styles.buyBar} ${
              hoverState === 'sell' ? styles.dimmed : ''
            }`}
            style={{ width: `${buyPercent}%` }}
            onMouseEnter={() => setHoverState('buy')}
            onMouseLeave={() => setHoverState(null)}
          />

          <div
            className={`${styles.sellBar} ${
              hoverState === 'buy' ? styles.dimmed : ''
            }`}
            style={{ width: `${sellPercent}%` }}
            onMouseEnter={() => setHoverState('sell')}
            onMouseLeave={() => setHoverState(null)}
          />

          <div
            className={styles.marker}
            style={{ left: `${buyPercent}%` }}
          />
        </div>

        <div
          className={`${styles.sellPercent} ${
            hoverState === 'buy' ? styles.dimmed : ''
          }`}
          onMouseEnter={() => setHoverState('sell')}
          onMouseLeave={() => setHoverState(null)}
        >
          {Math.round(sellPercent)}%
        </div>
      </div>

      <div className={styles.stats}>
        <div>
          <div className={styles.label}>Buy vol</div>
          <div className={buyVolume === 0 ? styles.bold : styles.buyVol}>
            {buyVolume === 0 ? '-' : formatCompactNumber(buyVolume)}
          </div>
        </div>

        <div>
          <div className={styles.label}>Ratio</div>
          <div className={styles.ratio}>
            {ratio ? (
              <>
                <span className={styles.buyVol}>
                  {formatCompactNumber(ratio)}
                </span>
                <span>:</span>
                <span className={styles.sellVol}>1</span>
              </>
            ) : (
              <span className={styles.bold}>-</span>
            )}
          </div>
        </div>

        <div>
          <div className={styles.label}>Sell vol</div>
          <div className={sellVolume === 0 ? styles.bold : styles.sellVol}>
            {sellVolume === 0 ? '-' : formatCompactNumber(sellVolume)}
          </div>
        </div>
      </div>
    </div>
  );
}
