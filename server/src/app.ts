import express from 'express';
import compression from 'compression';

import routes from '@/routes';

import { requestIdMiddleware } from '@/middleware/request-id';
import { helmetMiddleware } from '@/middleware/helmet';
import { loggerMiddleware } from '@/middleware/logger';
import { corsMiddleware } from '@/middleware/cors';

import { notFound } from '@/middleware/not-found';
import { errorHandler } from '@/middleware/error-handler';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(requestIdMiddleware);
  app.use(helmetMiddleware);
  app.use(loggerMiddleware);
  app.use(corsMiddleware);
  app.use(compression());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
