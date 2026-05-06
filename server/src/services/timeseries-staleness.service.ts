import { getNewestTimeseriesTimestamp } from '@/repositories/timeseries.repository';
import type { TTimestep } from '@/types/timeseries';

const STALE_AFTER_MS_BY_TIMESTEP: Record<TTimestep, number> = {
  '5m': 10 * 60 * 1000,
  '1h': 2 * 60 * 60 * 1000,
  '6h': 12 * 60 * 60 * 1000,
  '24h': 48 * 60 * 60 * 1000,
};

export async function shouldRefreshTimeseries(
  id: number,
  timestep: TTimestep,
): Promise<boolean> {
  const newestStoredTimestamp = await getNewestTimeseriesTimestamp(
    id,
    timestep,
  );

  if (newestStoredTimestamp == null) return true;

  const staleAfterMs = STALE_AFTER_MS_BY_TIMESTEP[timestep];
  const newestStoredTimestampMs = newestStoredTimestamp * 1000;
  const nowMs = Date.now();

  return nowMs - newestStoredTimestampMs >= staleAfterMs;
}
