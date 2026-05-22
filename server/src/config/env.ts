import 'dotenv/config';
import { z } from 'zod';

const urlListSchema = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .refine(
    (origins) => origins.every((origin) => z.url().safeParse(origin).success),
    {
      message: 'All CORS origins must be valid URLs',
    },
  );

const envSchema = z.object({
  INTERNAL_API_KEY: z.string().min(32),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  DATABASE_URL: z.string().min(1),

  WIKI_BASE_URL: z.string().min(1),
  WG_BASE_URL: z.string().min(1),

  CORS_ORIGINS_DEV: urlListSchema.default([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]),
  CORS_ORIGINS_PROD: urlListSchema,

  // Railway-provided variables
  RAILWAY_ENVIRONMENT_NAME: z
    .enum(['development', 'production'])
    .default('development'),
  RAILWAY_PUBLIC_DOMAIN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
