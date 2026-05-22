import { Router } from 'express';

import { LATEST_PREFIX, MAPPING_PREFIX, VALID_IDS_PREFIX } from '@/config/app';

import mappingRoutes from '@/routes/internal/sync/mapping.routes';
import latestRoutes from '@/routes/internal/sync/latest.routes';
import validIdsRoutes from '@/routes/internal/sync/valid-ids.routes';

const router = Router();

router.use(MAPPING_PREFIX, mappingRoutes);
router.use(LATEST_PREFIX, latestRoutes);
router.use(VALID_IDS_PREFIX, validIdsRoutes);

export default router;
