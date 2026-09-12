"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LocalUser } from "@/types";
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  SignupResult,
} from "@/lib/api/auth";
import { getToken, getStoredUser } from "@/lib/api/client";

interface AuthContextValue {
  user: LocalUser | null;
  /** true only during the initial restore-from-storage check on mount */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<SignupResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from sessionStorage on first mount (survives refresh).
  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const loggedInUser = await apiLogin(email, password);
    setUser(loggedInUser);
  }

  async function signup(email: string, password: string): Promise<SignupResult> {
    const result = await apiSignup(email, password);
    if (!result.requiresEmailConfirmation) {
      setUser(result.user);
    }
    return result;
  }

  function logout() {
    apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside an <AuthProvider>");
  }
  return ctx;
}
