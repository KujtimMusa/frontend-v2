/**
 * API Client mit Shopify Session Token Support für embedded Apps
 *
 * Nutzung:
 * - In embedded Kontext: sessionToken von useShopify() übergeben
 * - In Standalone: sessionToken = null → X-Session-ID aus localStorage
 */
import { API_URL } from './api';

export interface GetHeadersOptions {
  sessionToken?: string | null;
  contentType?: string;
}

export function getApiHeaders(options: GetHeadersOptions = {}): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': options.contentType ?? 'application/json',
  };

  // Embedded: Session Token von App Bridge
  if (options.sessionToken) {
    headers['Authorization'] = `Bearer ${options.sessionToken}`;
  } else if (typeof window !== 'undefined') {
    // Fallback Standalone: X-Session-ID
    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
  }

  return headers;
}

export interface FetchWithAuthOptions extends Omit<RequestInit, 'headers'> {
  sessionToken?: string | null;
  headers?: Record<string, string>;
}

export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { sessionToken, headers: customHeaders, ...rest } = options;
  const authHeaders = getApiHeaders({ sessionToken });
  const headers = {
    ...authHeaders,
    ...customHeaders,
  };

  return fetch(url, {
    ...rest,
    headers,
    credentials: 'include',
  });
}
