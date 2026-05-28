import { MAX_TAX_RESULT, TAX_RATE } from '@/constants';

import { formatCompactNumber } from './formatters';

import type { TItem } from '@/types/item';

export interface IItemMetrics {
  rawTax: number;
  tax: number;
  formattedTax: string;
  marginValue: number;
  potentialProfitValue: number;
  marginText: string;
  potentialProfitText: string;
  roiValue: number;
  roiText: string;
  isNegative: (value: number) => boolean;
}

export function getItemMetrics(item?: TItem | null): IItemMetrics {
  const high = item?.high;
  const low = item?.low;
  const limit = item?.limit ?? 0;

  const rawTax = high != null ? Math.floor(high * TAX_RATE) : 0;

  const tax = Math.min(rawTax, MAX_TAX_RESULT);

  const hasPrices = high != null && low != null;

  const marginValue = hasPrices ? high - low - tax : -tax;

  const potentialProfitValue = marginValue * limit;

  const marginText = hasPrices
    ? formatCompactNumber(marginValue)
    : formatCompactNumber(-tax);

  const potentialProfitText =
    hasPrices && item?.limit != null
      ? formatCompactNumber(potentialProfitValue)
      : '-';

  const roiValue = hasPrices && low > 0 ? (marginValue / low) * 100 : 0;

  const roiText =
    hasPrices && low > 0 ? `${((marginValue / low) * 100).toFixed(2)}` : '-';

  const isNegative = (value: number) => value < 0;

  return {
    rawTax,
    tax,
    formattedTax: high != null && tax !== 0 ? formatCompactNumber(-tax) : '-',
    marginValue,
    potentialProfitValue,
    marginText: marginValue === 0 ? '-' : marginText,
    potentialProfitText: potentialProfitValue === 0 ? '-' : potentialProfitText,
    roiValue,
    roiText: roiValue === 0 ? '-' : roiText,
    isNegative,
  };
}
