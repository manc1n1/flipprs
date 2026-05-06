import { Router } from 'express';

import { API_PREFIX, INTERNAL_PREFIX, ROOT } from '@/config/app';

import healthRoutes from '@/routes/health.routes';
import internalRoutes from '@/routes/internal';
import apiRoutes from '@/routes/api';

const router = Router();

router.use(ROOT, healthRoutes);
router.use(INTERNAL_PREFIX, internalRoutes);
router.use(API_PREFIX, apiRoutes);

export default router;
