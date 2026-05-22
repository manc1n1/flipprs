import { Router } from 'express';

import { ROOT } from '@/config/app';

import { refreshValidIdsCacheHandler } from '@/controllers/internal.controller';

import { requireInternalApiKey } from '@/middleware/internal-auth';

const router = Router();

router.post(ROOT, requireInternalApiKey, refreshValidIdsCacheHandler);

export default router;
