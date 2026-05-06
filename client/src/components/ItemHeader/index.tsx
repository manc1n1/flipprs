import styles from './ItemHeader.module.css';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Copy,
  CopyCheck,
  Equal,
  Heart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { ReactComponent as OSRSWikiLogo } from '@/assets/images/osrswiki.svg';
import { ReactComponent as OSRS } from '@/assets/images/osrs.svg';

import WikiImage from '@/components/WikiImage';
import { LastUpdateTime } from '../ItemMetrics/LastUpdateTime';

import { useFavourites } from '@/hooks/useFavourites';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useHaptics } from '@/hooks/useHaptics';

import type { TItem, TPriceChangeSummary } from '@/types/item';
import type { TTIME_RANGE_KEY } from '@/types/chart';
import { PriceChange } from '../ItemMetrics/PriceChange';

const ItemHeader = memo(function ItemHeader({
  item,
  range,
  currentPrice,
  latestTrade,
  priceChangeSummary,
}: {
  item: TItem;
  range: TTIME_RANGE_KEY;
  currentPrice: number;
  latestTrade: number;
  priceChangeSummary: TPriceChangeSummary | null;
}) {
  const { success, selection } = useHaptics();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { copy } = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    selection();
  }, [selection]);

  const handleFavourite = useCallback(() => {
    selection();
    toggleFavourite(item.id);
  }, [item.id, selection, toggleFavourite]);

  const handleCopy = useCallback(() => {
    success();
    copy(window.location.href);

    setCopied(true);

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
      copyTimeoutRef.current = null;
    }, 2000);
  }, [copy, success]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.item}>
          <WikiImage
            icon={item.icon}
            alt={item.name}
          />
          {item.name}
          <motion.button
            type='button'
            aria-label='Add favourite'
            onClick={handleFavourite}
            className={styles.favouriteMotionButton}
            whileTap={{ scale: 0.95 }}
          >
            {isFavourite(item.id) ? (
              <Heart className={styles.favoriteFill} />
            ) : (
              <Heart className={styles.favouriteOutline} />
            )}
          </motion.button>
        </div>
      </div>
      <div className={styles.subheader}>
        <span className={styles.currentPrice}>
          <PriceChange value={currentPrice} />
        </span>
      </div>
      <span
        className={`${styles.priceChange} ${
          priceChangeSummary && priceChangeSummary.valueChange > 0
            ? styles.positive
            : priceChangeSummary && priceChangeSummary.valueChange < 0
              ? styles.negative
              : styles.neutral
        }`}
      >
        {priceChangeSummary ? (
          <>
            <div>
              {priceChangeSummary.valueChange >= 0 ? '+' : ''}
              {priceChangeSummary.valueChange.toLocaleString()}
            </div>
            <div>{`(${priceChangeSummary.percentChange.toFixed(2)}%)`}</div>
            <div>
              {priceChangeSummary.valueChange > 0 ? (
                <TrendingUp />
              ) : priceChangeSummary.valueChange < 0 ? (
                <TrendingDown />
              ) : (
                <Equal />
              )}
            </div>
            <div>{range}</div>
          </>
        ) : (
          <></>
        )}
      </span>
      <span className={styles.timestamp}>
        Last traded&nbsp;
        <LastUpdateTime timestamp={latestTrade} />
      </span>
      <div className={styles.subheader}>
        <span className={styles.itemId}>Item ID: {item.id}</span>
        <div className={styles.links}>
          <Link
            to={`https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${item.id}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <motion.button
              type='button'
              aria-label='To wiki'
              onClick={handleClick}
              className={styles.motionButton}
              whileTap={{ scale: 0.95 }}
            >
              <OSRSWikiLogo className={styles.wikiIcon} />
            </motion.button>
          </Link>
          <Link
            to={`https://secure.runescape.com/m=itemdb_oldschool/viewitem?obj=${item.id}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <motion.button
              type='button'
              tabIndex={0}
              aria-label='To official grand exchange'
              onClick={handleClick}
              className={styles.motionButton}
              whileTap={{ scale: 0.95 }}
            >
              <OSRS className={styles.osrsIcon} />
            </motion.button>
          </Link>
          <motion.button
            type='button'
            aria-label='Copy to clipboard'
            onClick={handleCopy}
            className={styles.motionButton}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <CopyCheck className={styles.copyIcon} />
            ) : (
              <Copy className={styles.copyIcon} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
});

export default ItemHeader;
