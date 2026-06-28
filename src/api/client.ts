/**
 * Minimal typed fetch wrapper for the worldcup26.ir REST API.
 *
 * GET endpoints are currently open (no auth). The client still supports an optional bearer
 * token and a single-flight 401 retry hook, so locking-down the API later needs no caller
 * changes — wire `setTokenProvider`/`reauthenticate` in an auth module if that day comes.
 */

export const API_BASE_URL = 'https://worldcup26.ir';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly isNetwork = false,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type TokenProvider = () => string | null | undefined;
let getToken: TokenProvider = () => null;
let reauthenticate: (() => Promise<string | null>) | null = null;

export function setTokenProvider(provider: TokenProvider) {
  getToken = provider;
}

export function setReauthenticate(fn: (() => Promise<string | null>) | null) {
  reauthenticate = fn;
}

async function rawRequest<T>(path: string, token: string | null | undefined, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    });
  } catch {
    throw new ApiError('Check your internet connection and try again.', 0, true);
  }

  if (!response.ok) {
    throw new ApiError(`Request failed (${response.status})`, response.status);
  }

  return (await response.json()) as T;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  try {
    return await rawRequest<T>(path, getToken(), signal);
  } catch (error) {
    // Single-flight re-auth on 401, then one retry.
    if (error instanceof ApiError && error.status === 401 && reauthenticate) {
      const fresh = await reauthenticate();
      return rawRequest<T>(path, fresh, signal);
    }
    throw error;
  }
}
