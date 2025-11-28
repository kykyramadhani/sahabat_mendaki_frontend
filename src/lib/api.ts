// src/lib/api.ts
import { useAuth } from './auth';

// Simple in-memory cache for GET requests (key => { ts, data })
const GET_CACHE = new Map<string, { ts: number; data: any }>();
const GET_CACHE_TTL_MS = 60 * 1000; // 60 seconds

export const getBaseUrl = () => {
  // Use NEXT_PUBLIC_API_BASE_URL if provided, otherwise relative path
  const baseUrl = typeof window !== 'undefined' && process?.env?.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : 'https://sahabat-mendaki-backend.vercel.app'; // Fallback to localhost:5000
  
  console.log('[API] Using base URL:', baseUrl);
  return baseUrl;
};

const getHeaders = () => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  return headers;
};

async function handleResponse(response: Response, retrying = false) {
  const data = await response.json().catch(() => ({}));
  
  if (response.status === 401 && !retrying) {
    // Token expired, try to refresh
    try {
      const refreshResponse = await fetch(`${getBaseUrl()}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: localStorage.getItem('refresh_token'),
        }),
      });

      if (refreshResponse.ok) {
        const { access_token, refresh_token } = await refreshResponse.json();
        localStorage.setItem('jwt', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Retry original request with new token
        const retryResponse = await fetch(response.url, {
          ...response,
          headers: getHeaders(),
        });
        return handleResponse(retryResponse, true);
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      // Clear invalid tokens and redirect to login
      localStorage.removeItem('jwt');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  if (!response.ok) throw { status: response.status, data };
  return data;
}

export async function postJson(path: string, body: any) {
  const base = getBaseUrl();
  const url = `${base}${path}`;
  console.log('[API] POST request to:', url);
  console.log('[API] Request body:', body);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  console.log('[API] Response status:', res.status);
  if (!res.ok) {
    console.error('[API] Error response:', res.statusText);
  }
  
  return handleResponse(res);
}

export async function getJson(path: string, params?: Record<string, any>) {
  const base = getBaseUrl();
  let url = `${base}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      qs.append(k, String(v));
    });
    const s = qs.toString();
    if (s) url += `?${s}`;
  }
  // Use cache for search GET requests to reduce repeat calls during quick UI interactions
  try {
    const cacheKey = url;
    const cached = GET_CACHE.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.ts < GET_CACHE_TTL_MS) {
      // return deep clone to avoid accidental mutation
      return JSON.parse(JSON.stringify(cached.data));
    }
  } catch (e) {
    // ignore cache errors
  }
  const res = await fetch(url, {
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  // store in cache (best-effort)
  try {
    GET_CACHE.set(url, { ts: Date.now(), data });
  } catch (e) {
    // ignore
  }
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export async function postJsonAuth(path: string, body: any) {
  const base = getBaseUrl();
  const url = `${base}${path}`;
  console.log('[API] POST (Auth) request to:', url);
  console.log('[API] Request body:', body);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  
  console.log('[API] Response status:', res.status);
  return handleResponse(res);
}
export async function patchJsonAuth(path: string, body: any) {
  const base = getBaseUrl();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function deleteJsonAuth(path: string) {
  const base = getBaseUrl();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  // Delete biasanya mengembalikan 200 OK dengan body pesan sederhana
  if (!res.ok) throw { status: res.status, statusText: res.statusText };
  return res.json().catch(() => ({}));
}

export async function getCashflow() {
  const base = getBaseUrl();
  const url = `${base}/bookings/cashlow`;

  console.log("[API] GET Cashflow:", url);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });

    return await handleResponse(res);

  } catch (error) {
    console.error("❌ Cashflow fetch error:", error);
    throw new Error(
      error instanceof Error ? error.message : JSON.stringify(error)
    );
  }
}
