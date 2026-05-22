import type { AreaData, UTCTimestamp } from 'lightweight-charts';

export type TTIME_RANGE_KEY = '1D' | '1W' | '1M' | '6M' | '1Y' | 'MAX';
export type TCHART_TIMESTEP = '5m' | '1h' | '6h' | '24h';
export type TAChart = {
  range: TTIME_RANGE_KEY;
  data: AreaData<UTCTimestamp>[];
};

export type TTimeseries = {
  timestamp: UTCTimestamp;
  avgHighPrice: number;
  avgLowPrice: number;
  highPriceVolume: number;
  lowPriceVolume: number;
};

export type THistoryTimeseries = {
  price: number;
  volume: number;
  timestamp: UTCTimestamp;
};
