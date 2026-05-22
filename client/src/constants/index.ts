import { TCHART_TIMESTEP, TTIME_RANGE_KEY } from '@/types/chart';

export const MARQUEE_ITEMS: string[] = [
  '3rd_age_pickaxe',
  'Tbow',
  'Scythe',
  'Shadow',
  'Vw',
  'Dds',
  'Blue_phat',
  'Santa',
  'Green_hween',
  'Durial321',
  'Whip',
  'Red_hween',
];

export const RANGE_TO_STEP: Record<
  Exclude<TTIME_RANGE_KEY, 'MAX'>,
  TCHART_TIMESTEP
> = {
  '1D': '5m',
  '1W': '1h',
  '1M': '6h',
  '6M': '24h',
  '1Y': '24h',
};

export const RANGE_TO_SECONDS: Record<
  Exclude<TTIME_RANGE_KEY, 'MAX'>,
  number
> = {
  '1D': 1 * 24 * 60 * 60,
  '1W': 7 * 24 * 60 * 60,
  '1M': 30 * 24 * 60 * 60,
  '6M': 180 * 24 * 60 * 60,
  '1Y': 365 * 24 * 60 * 60,
};

export const TIME_RANGE_ORDER: TTIME_RANGE_KEY[] = [
  '1D',
  '1W',
  '1M',
  '6M',
  '1Y',
  'MAX',
];
