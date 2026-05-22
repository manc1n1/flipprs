import { AsyncLocalStorage } from 'node:async_hooks';

export interface IRequestContext {
  requestId: string;
}

const requestContext = new AsyncLocalStorage<IRequestContext>();

export function runWithRequestContext<T>(
  context: IRequestContext,
  callback: () => T,
): T {
  return requestContext.run(context, callback);
}

export function getRequestContext(): IRequestContext | undefined {
  return requestContext.getStore();
}

export function getRequestId(): string | undefined {
  return requestContext.getStore()?.requestId;
}
