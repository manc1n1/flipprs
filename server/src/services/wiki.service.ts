import { env } from '@/config/env';

import type {
  IWikiHistoryTimeseriesResponse,
  IWikiLatestResponse,
  IWikiMappingItem,
  IWikiTimeseriesPoint,
  IWikiTimeseriesResponse,
  IWikiVolumesResponse,
} from '@/types/wiki';
import type { TTimestep } from '@/types/timeseries';

const WIKI_BASE_URL = env.WIKI_BASE_URL;
const WG_BASE_URL = env.WG_BASE_URL;

async function wikiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${WIKI_BASE_URL}${path}`, {
    headers: {
      'User-Agent': 'flipprs/1.0',
      From: '@Suspext on Discord',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Wiki request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

async function weirdGloopFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${WG_BASE_URL}${path}`, {
    headers: {
      'User-Agent': 'flipprs/1.0',
      From: '@Suspext on Discord',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Weird Gloop request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export async function fetchMapping(): Promise<IWikiMappingItem[]> {
  return wikiFetch<IWikiMappingItem[]>('/mapping');
}

export async function fetchLatest(): Promise<IWikiLatestResponse> {
  return wikiFetch<IWikiLatestResponse>('/latest');
}

export async function fetchVolumes(): Promise<IWikiVolumesResponse> {
  return wikiFetch<IWikiVolumesResponse>('/volumes');
}

export async function fetchTimeseries(
  timestep: TTimestep,
  id: number,
): Promise<IWikiTimeseriesPoint[]> {
  const response = await wikiFetch<IWikiTimeseriesResponse>(
    `/timeseries?timestep=${encodeURIComponent(timestep)}&id=${id}`,
  );

  return response.data;
}

export async function fetchHistoryTimeseries(
  id: number,
): Promise<IWikiHistoryTimeseriesResponse> {
  return weirdGloopFetch<IWikiHistoryTimeseriesResponse>(`/all?id=${id}`);
}
