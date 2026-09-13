"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter both email and password.");
      return;
    }

    setSubmitting(true);

    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.body.error
          : "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b12] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <section
          data-page="login"
          className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40"
        >
          {/* Logo / Brand */}
          <div className="border-b border-white/10 px-6 py-7 text-center sm:px-8">
            <a href="/" className="inline-flex flex-col items-center">
              <img
                src="/images/life-rpg-logo.png"
                alt="Life RPG"
                className="mb-3 h-16 w-auto object-contain"
              />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                Level up your life
              </p>
            </a>

            <h1 className="mt-5 text-3xl font-bold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Log in and continue your adventure.
            </p>
          </div>

          {/* Login form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 p-6 sm:p-8"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-purple-400/60 focus:bg-black/30 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-purple-400/60 focus:bg-black/30 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3">
                <p
                  role="alert"
                  className="text-sm leading-5 text-red-300"
                >
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Logging in…" : "Enter the Adventure"}
            </button>
          </form>

          {/* Sign up */}
          <div className="border-t border-white/10 px-6 py-5 text-center sm:px-8">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-purple-400 transition hover:text-purple-300"
              >
                Create one
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}