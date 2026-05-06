import { Router } from 'express';

import { ROOT } from '@/config/app';

import {
  getItemByIdHandler,
  getSearchItemsHandler,
} from '@/controllers/items.controller';

import { createRateLimiter } from '@/middleware/rate-limit';

const router = Router();

router.get(ROOT, createRateLimiter(), getSearchItemsHandler);
router.get('/:id', createRateLimiter(), getItemByIdHandler);

export default router;
