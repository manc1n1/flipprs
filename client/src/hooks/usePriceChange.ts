import { useEffect, useRef, useState } from 'react';

type TPriceChange = 'positive' | 'negative' | null;

export function usePriceChange(
  value?: number | null,
  duration: number = 1000,
): TPriceChange {
  const prev = useRef<number | null>(null);
  const [priceChange, setPriceChange] = useState<TPriceChange>(null);

  useEffect(() => {
    if (value != null && prev.current != null) {
      if (value > prev.current) setPriceChange('positive');
      else if (value < prev.current) setPriceChange('negative');
    }
    prev.current = value ?? null;
  }, [value]);

  useEffect(() => {
    if (priceChange) {
      const timer = setTimeout(() => setPriceChange(null), duration);
      return () => clearTimeout(timer);
    }
  }, [priceChange, duration]);

  return priceChange;
}
