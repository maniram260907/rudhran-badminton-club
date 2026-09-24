"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MemberLoginPage() {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/member/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid mobile number or password.");
        return;
      }

      router.push("/member");
    } catch (error) {
      console.error("Member login failed:", error);
      setError("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b0d] px-5 py-10 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-400/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-[fadeIn_0.6s_ease-out]">

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-2xl shadow-lg shadow-lime-400/20">
              🏸
            </div>

            <div className="text-left">
              <p className="text-lg font-black tracking-wide text-white">
                RUDHRAN
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lime-400">
                Badminton Club
              </p>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="rounded-[2rem] border border-white/10 bg-white p-7 text-slate-900 shadow-2xl shadow-black/30 sm:p-9">

          {/* Heading */}
          <div className="mb-7">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-600">
              Member Area
            </p>

            <h1 className="text-3xl font-black tracking-tight">
              Welcome back 👋
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Login to access your Rudhran Badminton Club account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobileNumber"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Mobile Number
              </label>

              <input
                id="mobileNumber"
                type="tel"
                value={mobileNumber}
                onChange={(event) => setMobileNumber(event.target.value)}
                placeholder="Enter your mobile number"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-slate-700"
                >
                  Password
                </label>

                <Link
                  href="/login/member/forgot-password"
                  className="text-xs font-bold text-lime-700 transition hover:text-lime-600"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-2xl bg-lime-400 px-4 py-3.5 font-black text-slate-950 shadow-lg shadow-lime-400/10 transition hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login to Account
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">
              Dont have an account?
            </p>

            <Link
              href="/login/member/register"
              className="mt-1 inline-block font-black text-lime-700 transition hover:text-lime-600"
            >
              Create Member Account →
            </Link>
          </div>

          {/* Home */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-400 transition hover:text-slate-700"
            >
              ← Back to Rudhran Badminton Club
            </Link>
          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center text-xs font-medium text-slate-500">
          Train hard. Play smart. Stay consistent. 🏸
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}