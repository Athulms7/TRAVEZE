export const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/auth";

export const CHATBOT_API_BASE_URL =
  import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:5000";

export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
}

export interface StoredAuthSession {
  token: string;
  user: AuthUser;
  rememberMe: boolean;
  expiresAt: number;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";
const AUTH_EXPIRED_EVENT = "traveze:auth-expired";

function decodeTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

function readFromStorage(storage: Storage, rememberMe: boolean): StoredAuthSession | null {
  const token = storage.getItem(TOKEN_KEY);
  const storedUser = storage.getItem(USER_KEY);
  if (!token || !storedUser) return null;

  const expiresAt = decodeTokenExpiry(token);
  if (!expiresAt || expiresAt <= Date.now()) return null;

  try {
    const user: AuthUser = JSON.parse(storedUser);
    if (typeof user.name !== "string" || typeof user.email !== "string") return null;
    return { token, user, rememberMe, expiresAt };
  } catch {
    return null;
  }
}

export function getStoredAuthSession(): StoredAuthSession | null {
  const temporary = readFromStorage(window.sessionStorage, false);
  if (temporary) return temporary;
  const persistent = readFromStorage(window.localStorage, true);
  if (persistent) return persistent;
  clearStoredAuthSession();
  return null;
}

export function storeAuthSession(token: string, user: AuthUser, rememberMe: boolean): void {
  const expiresAt = decodeTokenExpiry(token);
  if (!expiresAt || expiresAt <= Date.now()) {
    throw new Error("The sign-in response contained an invalid or expired token.");
  }

  clearStoredAuthSession();
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuthSession(): void {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  }
}

export function notifyAuthenticationExpired(): void {
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}

export function addAuthenticationExpiredListener(listener: () => void): () => void {
  window.addEventListener(AUTH_EXPIRED_EVENT, listener);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
}

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const session = getStoredAuthSession();
  const headers = new Headers(init.headers);
  if (session) headers.set("Authorization", `Bearer ${session.token}`);

  const response = await fetch(input, { ...init, headers });
  if (response.status === 401 && session) notifyAuthenticationExpired();
  return response;
}
