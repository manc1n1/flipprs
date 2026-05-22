import type { TTimestep } from '@/types/timeseries';

const VALID_TIMESTEPS: TTimestep[] = ['5m', '1h', '6h', '24h'];

export function isValidTimestep(value: string): value is TTimestep {
  return VALID_TIMESTEPS.includes(value as TTimestep);
}
