export type TSearchItem = {
  id: number;
  icon: string;
  name: string;
};

export type TItem = TSearchItem & {
  examine: string;
  members: boolean;
  lowalch: number;
  limit: number;
  value: number;
  highalch: number;
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
  volume: number;
};

export type TPriceChangeSummary = {
  valueChange: number;
  percentChange: number;
  recentPrice: number;
  latestTrade: number;
  oldestPrice: number;
};
