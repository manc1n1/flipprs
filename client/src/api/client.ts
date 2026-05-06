const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error('Missing VITE_API_URL');

export type ApiErrorCode =
  | 'UNKNOWN'
  | 'NETWORK_ERROR'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_SERVICE_ERROR';

export class ApiError extends Error {
  status: number | null;
  code: ApiErrorCode;

  constructor(message: string, status: number | null, code: ApiErrorCode) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: buildHeaders(init),
    });

    const contentType = res.headers.get('content-type');
    let body: unknown = null;

    if (contentType?.includes('application/json')) {
      body = await res.json();
    } else {
      body = await res.text();
    }

    if (!res.ok) {
      const maybe =
        body && typeof body === 'object'
          ? (body as Record<string, unknown>)
          : null;

      const message =
        typeof maybe?.error === 'string'
          ? maybe.error
          : `Request failed with status ${res.status}`;

      const code =
        typeof maybe?.code === 'string'
          ? (maybe.code as ApiErrorCode)
          : mapStatusToCode(res.status);

      throw new ApiError(message, res.status, code);
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError('Could not connect to server', null, 'NETWORK_ERROR');
  }
}

function mapStatusToCode(status: number): ApiErrorCode {
  switch (status) {
    case 404:
      return 'NOT_FOUND';
    case 429:
      return 'RATE_LIMITED';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    case 500:
      return 'INTERNAL_SERVICE_ERROR';
    default:
      return 'UNKNOWN';
  }
}

function buildHeaders(init?: RequestInit): HeadersInit {
  const headers = new Headers(init?.headers);

  const hasBody = init?.body != null;
  const bodyIsFormData =
    typeof FormData !== 'undefined' && init?.body instanceof FormData;

  if (hasBody && !bodyIsFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}
