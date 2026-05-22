export interface IWikiMappingItem {
  examine: string;
  id: number;
  members: boolean;
  lowalch: number;
  limit: number;
  value: number;
  highalch: number;
  icon: string | null;
  name: string;
}

export interface IWikiLatestItem {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
}

export interface IWikiLatestResponse {
  data: Record<string, IWikiLatestItem>;
}

export interface IWikiVolumesResponse {
  data: Record<string, number>;
}

export interface IWikiTimeseriesPoint {
  timestamp: number;
  avgHighPrice: number;
  avgLowPrice: number;
  highPriceVolume: number;
  lowPriceVolume: number;
}

export interface IWikiTimeseriesResponse {
  data: IWikiTimeseriesPoint[];
}

export interface IWikiHistoryTimeseriesPoint {
  id: string;
  price: number;
  volume: number;
  timestamp: number;
}

export type IWikiHistoryTimeseriesResponse = Record<
  string,
  IWikiHistoryTimeseriesPoint[]
>;
