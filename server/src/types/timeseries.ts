import type { IWikiTimeseriesPoint } from '@/types/wiki';

export type TTimestep = '5m' | '1h' | '6h' | '24h';

export interface ITimeseriesPoint extends IWikiTimeseriesPoint {
  id: number;
  timestep: TTimestep;
  createdAt: Date;
}

export interface ITimeseriesFreshness {
  newestTimestamp: number | null;
  newestCreatedAt: Date | null;
  pointCount: number;
}

export interface ISyncTimeseriesResult {
  id: number;
  timestep: TTimestep;
  upstreamCount: number;
  candidateCount: number;
  addedCount: number;
  deletedCount: number;
}
