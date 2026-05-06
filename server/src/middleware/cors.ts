import cors from 'cors';

import { env } from '@/config/env';

const allowedOrigins =
  env.RAILWAY_ENVIRONMENT_NAME === 'production'
    ? env.CORS_ORIGINS_PROD
    : env.CORS_ORIGINS_DEV;

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-Id',
    'x-api-key',
  ],
  exposedHeaders: ['X-Request-Id'],
  credentials: false,
  optionsSuccessStatus: 204,
});
