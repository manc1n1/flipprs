import type { IWikiLatestItem } from '@/types/wiki';

export interface ILatestItem extends IWikiLatestItem {
  id: number;
  volume: number;
  updatedAt: Date;
}
