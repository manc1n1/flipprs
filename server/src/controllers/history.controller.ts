import type { Request, Response } from 'express';

import { getHistoryTimeseriesById } from '@/services/history.service';

export async function getHistoryTimeseriesByIdHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  try {
    const history = await getHistoryTimeseriesById(id);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch history',
    });
  }
}
