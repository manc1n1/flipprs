import { useMemo } from 'react';

interface IUseTaxResult {
  rawTax: number;
  tax: number;
  formattedTax: string;
}

const TAX_RATE = 0.02;
const MAX_TAX_RESULT = 5_000_000;

export function useTax(price?: number): IUseTaxResult {
  return useMemo<IUseTaxResult>(() => {
    if (price == null) {
      return {
        rawTax: 0,
        tax: 0,
        formattedTax: 'N/A',
      };
    }

    const rawTax = Math.floor(price * TAX_RATE);
    const tax = Math.min(rawTax, MAX_TAX_RESULT);

    return {
      rawTax,
      tax,
      formattedTax: tax.toLocaleString(),
    };
  }, [price]);
}
