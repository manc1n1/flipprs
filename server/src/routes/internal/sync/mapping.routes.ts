import { Router } from 'express';

import { ROOT } from '@/config/app';

import { syncMappingHandler } from '@/controllers/internal.controller';

import { requireInternalApiKey } from '@/middleware/internal-auth';

const router = Router();

router.post(ROOT, requireInternalApiKey, syncMappingHandler);

export default router;
