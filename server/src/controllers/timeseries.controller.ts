import type { Request, Response } from 'express';

import { getOrRefreshTimeseries } from '@/services/timeseries.service';
import { isValidIdCached } from '@/services/cache/valid-ids-cache';

import { isValidTimestep } from '@/utils/is-valid-timestep';
import { logger } from '@/utils/logger';

export async function getTimeseriesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.query.id);
  const timestep = String(req.query.timestep);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  if (!isValidTimestep(timestep)) {
    res.status(400).json({ error: 'Invalid timestep' });
    return;
  }

  if (!isValidIdCached(id)) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  try {
    const timeseries = await getOrRefreshTimeseries(id, timestep);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(timeseries);
  } catch (error) {
    logger.error('Failed to get timeseries', { id, timestep, error });

    res.status(500).json({ error: 'Failed to get timeseries' });
  }
}
