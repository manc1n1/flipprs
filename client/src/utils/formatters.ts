import { UTCTimestamp } from 'lightweight-charts';

export function formatTimestamp(value: UTCTimestamp): string {
  const date = new Date(value * 1000);

  return date.toLocaleString(navigator.language, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatCompactNumber(
  value: number | null,
  maximumFractionDigits = 2,
): string {
  if (value == null) return '-';

  return Intl.NumberFormat(navigator.language, {
    notation: 'compact',
    maximumFractionDigits,
  }).format(value);
}
