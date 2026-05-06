import styles from './Marquee.module.css';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type TMarqueeProps = {
  children: React.ReactNode;
};

const Marquee = ({ children }: TMarqueeProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [multiplier, setMultiplier] = useState(1);

  const calculateMultiplier = useCallback(() => {
    if (!containerRef.current || !marqueeRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const marqueeRect = marqueeRef.current.getBoundingClientRect();

    const containerWidth = containerRect.width;
    const marqueeWidth = marqueeRect.width;

    if (marqueeWidth < containerWidth) {
      setMultiplier(Math.ceil(containerWidth / marqueeWidth));
    } else {
      setMultiplier(1);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    calculateMultiplier();
    if (containerRef.current && marqueeRef.current) {
      const resizeObserver = new ResizeObserver(() => calculateMultiplier());
      resizeObserver.observe(containerRef.current);
      resizeObserver.observe(marqueeRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [calculateMultiplier, isMounted]);

  const multiplyChildren = useCallback(
    (multiplier: number) => {
      const arraySize = multiplier >= 0 ? multiplier : 0;
      return [...Array(arraySize)].map((_, i) => (
        <Fragment key={i}>{children}</Fragment>
      ));
    },
    [children],
  );

  if (!isMounted) return null;

  return (
    <motion.div
      className={styles.container}
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.marquee}
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className={styles.firstMarquee}
          ref={marqueeRef}
        >
          {children}
        </div>
        {multiplyChildren(multiplier - 1)}
      </motion.div>
      <motion.div
        className={styles.marquee}
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {multiplyChildren(multiplier)}
      </motion.div>
    </motion.div>
  );
};

export default Marquee;
