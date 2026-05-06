import { Router } from 'express';

import { SYNC_PREFIX } from '@/config/app';

import syncRoutes from '@/routes/internal/sync';

const router = Router();

router.use(SYNC_PREFIX, syncRoutes);

export default router;
