import { useMemo } from 'react';

import { useTax } from './useTax';

import type { TItem } from '@/types/item';

interface IItemMetrics {
  marginValue: number;
  potentialProfitValue: number;
  roi: string;
  marginText: string;
  potentialProfitText: string;
  isNegative: (value: number) => boolean;
}

export function useItemMetrics(item?: TItem | null): IItemMetrics {
  const { tax } = useTax(item?.high ?? 0);

  return useMemo(() => {
    const high = item?.high;
    const low = item?.low;
    const limit = item?.limit ?? 0;

    const hasPrices = high != null && low != null;

    const marginValue = hasPrices ? high - low - tax : -tax;
    const potentialProfitValue = marginValue * limit;

    const roi =
      hasPrices && low > 0
        ? `${((marginValue / low) * 100).toFixed(2)}%`
        : '-%';

    const marginText = hasPrices ? marginValue.toLocaleString() : `${-tax}`;

    const potentialProfitText =
      hasPrices && item!.limit != null
        ? potentialProfitValue.toLocaleString()
        : '-';

    const isNegative = (value: number) => value < 0;

    return {
      marginValue,
      potentialProfitValue,
      roi,
      marginText,
      potentialProfitText,
      isNegative,
    };
  }, [item, tax]);
}
