import { Router } from 'express';

import { API_VERSION } from '@/config/app';

import v1Routes from '@/routes/api/v1';

const router = Router();

router.use(API_VERSION, v1Routes);

export default router;
