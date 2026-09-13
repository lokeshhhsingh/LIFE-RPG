import { AuthResponse, LoginResponse, LocalUser } from "@/types";
import { apiFetch, setToken, clearToken, setStoredUser, clearStoredUser } from "./client";

export interface SignupResult {
  user: LocalUser;
  /** true if backend didn't return a token — email confirmation required */
  requiresEmailConfirmation: boolean;
}

export async function signup(email: string, password: string): Promise<SignupResult> {
  const res = await apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const user: LocalUser = { user_id: res.user_id, email };

  if (res.access_token) {
    setToken(res.access_token);
    setStoredUser(user);
  }

  return { user, requiresEmailConfirmation: !res.access_token };
}

export async function login(email: string, password: string): Promise<LocalUser> {
  const res = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const user: LocalUser = { user_id: res.user_id, email };
  setToken(res.access_token);
  setStoredUser(user);
  return user;
}

export function logout() {
  // Stateless tokens, no server-side logout endpoint — just discard locally.
  clearToken();
  clearStoredUser();
}

export async function getCurrentUser(): Promise<{ user_id: string } | null> {
  try {
    return await apiFetch<{ user_id: string }>("/me");
  } catch {
    return null;
  }
}
