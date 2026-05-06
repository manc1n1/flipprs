import type { IWikiHistoryTimeseriesPoint } from '@/types/wiki';

export interface IHistoryTimeseriesPoint extends IWikiHistoryTimeseriesPoint {
  createdAt: Date;
}
