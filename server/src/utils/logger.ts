import { env } from '@/config/env';

import { getRequestId } from '@/lib/request-context';

type TMeta = Record<string, unknown>;
type TLevel = 'info' | 'error' | 'warn' | 'debug';

function withRequestContext(meta?: TMeta): TMeta {
  const requestId = getRequestId();

  return {
    ...(requestId ? { requestId } : {}),
    environment: env.RAILWAY_ENVIRONMENT_NAME,
    ...meta,
  };
}

function serializeMeta(meta?: TMeta): TMeta {
  if (!meta) {
    return {};
  }

  const serialized: TMeta = {};

  for (const [key, value] of Object.entries(meta)) {
    if (value instanceof Error) {
      serialized[key] = {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    } else {
      serialized[key] = value;
    }
  }

  return serialized;
}

function colorize(level: TLevel, text: string): string {
  switch (level) {
    case 'info':
      return `\x1b[36m${text}\x1b[0m`;
    case 'warn':
      return `\x1b[33m${text}\x1b[0m`;
    case 'error':
      return `\x1b[31m${text}\x1b[0m`;
    case 'debug':
      return `\x1b[90m${text}\x1b[0m`;
    default:
      return text;
  }
}

function formatDevLog(level: TLevel, message: string, meta?: TMeta): string {
  const timestamp = new Date().toLocaleTimeString();
  const context = withRequestContext(serializeMeta(meta));

  const header = `${colorize(level, `[${level.toUpperCase()}]`)} ${timestamp} - ${message}`;

  const contextEntries = Object.entries(context);

  if (contextEntries.length === 0) {
    return header;
  }

  const detailLines = contextEntries.map(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return `  ${key}: ${JSON.stringify(value, null, 2)
        .split('\n')
        .join('\n  ')}`;
    }

    return `  ${key}: ${String(value)}`;
  });

  return `${header}\n${detailLines.join('\n')}`;
}

function formatProdLog(level: TLevel, message: string, meta?: TMeta): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...withRequestContext(serializeMeta(meta)),
  });
}

function write(level: TLevel, message: string, meta?: TMeta): void {
  const isProd = env.RAILWAY_ENVIRONMENT_NAME === 'production';
  const line = isProd
    ? formatProdLog(level, message, meta)
    : formatDevLog(level, message, meta);

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  info(message: string, meta?: TMeta) {
    write('info', message, meta);
  },

  warn(message: string, meta?: TMeta) {
    write('warn', message, meta);
  },

  error(message: string, meta?: TMeta) {
    write('error', message, meta);
  },

  debug(message: string, meta?: TMeta) {
    write('debug', message, meta);
  },
};
