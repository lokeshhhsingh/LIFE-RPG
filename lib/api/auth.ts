import { User } from "@/types";
import { apiFetch } from "./client";

/**
 * MOCK MODE: returns a fake user after a delay so the rest of the app can
 * be built against a realistic async shape. Replace the bodies of these
 * three functions with real `apiFetch` calls once backend auth is live —
 * function signatures below should not need to change, so nothing that
 * calls useAuth() has to be touched.
 */

const MOCK_DELAY_MS = 500;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

function mockUser(email: string): User {
  return {
    id: "mock-user-1",
    email,
    displayName: email.split("@")[0],
    createdAt: new Date().toISOString(),
  };
}

export async function login(email: string, password: string): Promise<User> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    return mockUser(email);
  }
  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    return { ...mockUser(email), displayName };
  }
  return apiFetch<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return;
  }
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<User | null> {
  if (USE_MOCK) {
    return null; // mock: nobody is logged in on fresh load
  }
  try {
    return await apiFetch<User>("/auth/me");
  } catch {
    return null;
  }
}
