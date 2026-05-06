import { useMemo } from 'react';

import { TItem } from '@/types/item';
import { useTax } from './useTax';

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
    const marginValue = (item?.high ?? 0) - (item?.low ?? 0) - tax;
    const potentialProfitValue = marginValue * (item?.limit ?? 0);

    const roi = ((marginValue / (item?.low ?? 0)) * 100).toFixed(2) + '%';

    const hasPrices = item?.high != null && item?.low != null;
    const marginText = hasPrices ? marginValue.toLocaleString() : 'N/A';
    const potentialProfitText =
      hasPrices && item!.limit != null
        ? potentialProfitValue.toLocaleString()
        : 'N/A';

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
