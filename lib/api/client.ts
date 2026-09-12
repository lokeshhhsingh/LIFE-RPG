import { ApiErrorBody, LocalUser } from "@/types";

/**
 * Backend contract uses Authorization: Bearer <token>, not cookies.
 * Token is stored in memory + sessionStorage (survives refresh, cleared
 * when tab closes — swap to localStorage if you want it to persist across
 * browser restarts, but that's a bigger XSS surface to be aware of).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
const TOKEN_KEY = "life-rpg-token";
const USER_KEY = "life-rpg-user";

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Backend never returns email anywhere (not even GET /me — just user_id),
 * so we persist the LocalUser alongside the token to restore it on page
 * refresh without an extra round trip.
 */
export function setStoredUser(user: LocalUser) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getStoredUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as LocalUser) : null;
}

export function clearStoredUser() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(USER_KEY);
  }
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;
  constructor(body: ApiErrorBody, status: number) {
    super(body.error);
    this.status = status;
    this.body = body;
  }
}

/** Fired when a request comes back 401 — wire this to redirect to /login. */
type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;
export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearToken();
    onUnauthorized?.();
  }

  if (!res.ok) {
    const body: ApiErrorBody = await res
      .json()
      .catch(() => ({ error: res.statusText }));
    throw new ApiError(body, res.status);
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
