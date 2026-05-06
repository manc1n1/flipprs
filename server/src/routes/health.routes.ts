import { Router } from 'express';

import { ROOT } from '@/config/app';

import {
  getHealth,
  getLive,
  getReady,
  getRoot,
} from '@/controllers/health.controller';

const router = Router();

router.get(ROOT, getRoot);
router.get('/live', getLive);
router.get('/ready', getReady);
router.get('/health', getHealth);

export default router;
