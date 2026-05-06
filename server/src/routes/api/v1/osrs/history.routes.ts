import { Router } from 'express';

import { getHistoryTimeseriesByIdHandler } from '@/controllers/history.controller';

const router = Router();

router.get('/:id', getHistoryTimeseriesByIdHandler);

export default router;
