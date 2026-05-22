import type { NextFunction, Request, Response } from 'express';

import { getFavourites } from '@/services/favourites.service';
import { isValidIdCached } from '@/services/cache/valid-ids-cache';

import { logger } from '@/utils/logger';

function parseIds(value: unknown[]): number[] {
  return [
    ...new Set(
      value
        .map((item) => Number(item))
        .filter((id) => Number.isInteger(id) && id > 0 && isValidIdCached(id)),
    ),
  ];
}

export async function getFavouritesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawIds = req.body.ids;

    if (!Array.isArray(rawIds)) {
      res.status(400).json({ error: 'ids must be an array' });
      return;
    }

    const ids = parseIds(rawIds);

    logger.info('Getting favourites', {
      idsCount: ids.length,
    });

    const result = await getFavourites(ids);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Failed to get favourites', { error });
    next(error);
  }
}
