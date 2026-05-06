import morgan from 'morgan';

import { env } from '@/config/env';

const isProd = env.RAILWAY_ENVIRONMENT_NAME === 'production';

export const loggerMiddleware = isProd ? morgan('combined') : morgan('dev');
