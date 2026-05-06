import { Router } from 'express';

import { createRateLimiter } from '@/middleware/rate-limit';

import itemRoutes from '@/routes/api/v1/osrs/items.routes';
import historyRoutes from '@/routes/api/v1/osrs/history.routes';

import { getTimeseriesHandler } from '@/controllers/timeseries.controller';
import { getFavouritesHandler } from '@/controllers/favourites.controller';

const router = Router();

router.use('/items', itemRoutes);
router.use('/timeseries', createRateLimiter(), getTimeseriesHandler);
router.use('/history', createRateLimiter(), historyRoutes);
router.use('/favourites', createRateLimiter(), getFavouritesHandler);

export default router;
