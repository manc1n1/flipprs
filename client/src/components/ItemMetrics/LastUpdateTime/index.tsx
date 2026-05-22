import { useLastUpdateTime } from '@/hooks/useLastUpdateTime';

export function LastUpdateTime({ timestamp }: { timestamp: number }) {
  const lastUpdate = useLastUpdateTime(timestamp);
  return <>{lastUpdate}</>;
}
