import type { NextFunction, Request, Response } from 'express';

import { getItemById, getSearchItems } from '@/services/items.service';

import { logger } from '@/utils/logger';

export async function getSearchItemsHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info('Getting search items');

    const items = await getSearchItems();

    res.status(200).json(items);
  } catch (error) {
    logger.error('Failed to get search items', { error });
    next(error);
  }
}

export async function getItemByIdHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid item id' });
    return;
  }

  try {
    const item = await getItemById(id);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(item);
  } catch (error) {
    if (error instanceof Error && error.message === 'Item not found') {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch item',
    });
  }
}
