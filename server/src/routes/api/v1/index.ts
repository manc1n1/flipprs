import { Router } from 'express';

import { GAME_PREFIX } from '@/config/app';

import osrsRoutes from '@/routes/api/v1/osrs';

const router = Router();

router.use(GAME_PREFIX, osrsRoutes);

export default router;
