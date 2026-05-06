import styles from './ItemDetails.module.css';

import { PriceChange } from '../ItemMetrics/PriceChange';
import { LastUpdateTime } from '../ItemMetrics/LastUpdateTime';
import { Volume } from '../ItemMetrics/Volume';
import { Tax } from '../ItemMetrics/Tax';
import { ROI } from '../ItemMetrics/ROI';
import { BuyLimit } from '../ItemMetrics/BuyLimit';
import { Margin } from '../ItemMetrics/Margin';
import { PotentialProfit } from '../ItemMetrics/PotentialProfit';

import type { TItem } from '@/types/item';

const ItemDetails = ({ item }: { item: TItem }) => {
  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <div>
          <span className={styles.title}>Buy price</span>
          <div className={styles.priceInfo}>
            <span className={styles.price}>
              <PriceChange value={item.high} />
            </span>
            <span className={styles.timestamp}>
              Last traded&nbsp;
              <LastUpdateTime timestamp={item.highTime} />
            </span>
          </div>
        </div>
        <div>
          <span className={styles.title}>Sell price</span>
          <div className={styles.priceInfo}>
            <span className={styles.price}>
              <PriceChange value={item.low} />
            </span>
            <span className={styles.timestamp}>
              Last traded&nbsp;
              <LastUpdateTime timestamp={item.lowTime} />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.subdetails}>
        <div>
          <span className={styles.title}>Volume</span>
          <span className={styles.span}>
            <Volume volume={item.volume} />
          </span>
        </div>
        <div>
          <span className={styles.title}>Buy limit</span>
          <span className={styles.span}>
            <BuyLimit item={item} />
          </span>
        </div>
        <div>
          <span className={styles.title}>Tax (2%)</span>
          <span className={styles.span}>
            <Tax price={item.high} />
          </span>
        </div>
        <div>
          <span className={styles.title}>Margin (after tax)</span>
          <span className={styles.span}>
            <Margin item={item} />
          </span>
        </div>
        <div>
          <span className={styles.title}>ROI</span>
          <span className={styles.span}>
            <ROI item={item} />
          </span>
        </div>
        <div>
          <span className={styles.title}>Potential profit</span>
          <span className={styles.span}>
            <PotentialProfit item={item} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
