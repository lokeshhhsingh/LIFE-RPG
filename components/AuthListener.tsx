"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Mounted inside AuthProvider in the root layout. Any apiFetch() call that
 * gets a 401 (expired/invalid token, per the contract's ~1hr expiry)
 * triggers this — calls the context's logout() so `user` state clears
 * everywhere, not just the token in storage, then redirects.
 */
export function AuthListener() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      router.push("/login");
    });
  }, [logout, router]);

  return null;
}
