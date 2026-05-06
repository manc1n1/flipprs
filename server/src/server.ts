import { createApp } from '@/app';

import { env } from '@/config/env';

import { testDbConnection } from '@/db/pool';
import { runMigrations } from '@/db/migrate';
import { resetDb } from '@/db/reset-db';

import { startScheduler } from '@/cron/scheduler';

import { syncMapping } from '@/services/sync/sync-mapping.service';
import { syncLatest } from '@/services/sync/sync-latest.service';
import { refreshValidIdsCache } from '@/services/cache/valid-ids-cache';

async function startServer(): Promise<void> {
  try {
    await testDbConnection();

    await runMigrations();

    if (env.RAILWAY_ENVIRONMENT_NAME === 'development') {
      await resetDb();
      console.log('Database reset complete');
    }

    console.log('Running initial sync...');
    await syncMapping();
    await syncLatest();
    await refreshValidIdsCache();
    console.log('Initial sync complete');

    const app = createApp();

    startScheduler();

    const host =
      env.RAILWAY_ENVIRONMENT_NAME === 'production' && env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${env.RAILWAY_PUBLIC_DOMAIN}`
        : `http://localhost:${env.PORT}`;

    app.listen(env.PORT, () => {
      console.log(`Server running on ${host}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

void startServer();
