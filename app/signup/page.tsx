"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter both email and password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await signup(email.trim(), password);

      if (result.requiresEmailConfirmation) {
        setNeedsConfirmation(true);
      } else {
        router.push("/dashboard");
      }
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
          data-page="signup"
          className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40"
        >
          {/* Brand */}
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
              Create Your Character
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Start your journey and turn your real life into an RPG.
            </p>
          </div>

          {needsConfirmation ? (
            /* Email confirmation */
            <div
              role="status"
              data-component="confirm-email-notice"
              className="p-6 sm:p-8"
            >
              <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/15 text-2xl">
                  ✉️
                </div>

                <h2 className="text-xl font-bold text-white">
                  Check your email
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  We sent you a confirmation email. Confirm your account,
                  then return to the{" "}
                  <a
                    href="/login"
                    className="font-semibold text-purple-400 transition hover:text-purple-300"
                  >
                    login page
                  </a>
                  .
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Signup form */}
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!error}
                    required
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-purple-400/60 focus:bg-black/30 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-gray-200"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-invalid={!!error}
                    required
                    placeholder="Enter your password again"
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
                  {submitting
                    ? "Creating character…"
                    : "Begin Your Adventure"}
                </button>
              </form>

              {/* Login link */}
              <div className="border-t border-white/10 px-6 py-5 text-center sm:px-8">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-purple-400 transition hover:text-purple-300"
                  >
                    Log in
                  </a>
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}