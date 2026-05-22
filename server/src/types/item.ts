import type { IWikiMappingItem } from '@/types/wiki';

export interface ISearchItem {
  id: number;
  icon: string | null;
  name: string;
}

export interface IItem extends IWikiMappingItem {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
  volume: number;
  updatedAt: Date;
}
