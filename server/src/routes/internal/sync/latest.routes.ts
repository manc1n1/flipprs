import { Router } from 'express';

import { ROOT } from '@/config/app';

import { syncLatestHandler } from '@/controllers/internal.controller';

import { requireInternalApiKey } from '@/middleware/internal-auth';

const router = Router();

router.post(ROOT, requireInternalApiKey, syncLatestHandler);

export default router;
