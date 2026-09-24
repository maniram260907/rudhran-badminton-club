"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
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
        setMessage(data.message || "Invalid admin login details.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Admin login failed:", error);
      setMessage("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b0d] text-white">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-yellow-400/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-lime-400/10 blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:45px_45px]" />
      </div>

      {/* Top navigation */}
      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-xl text-black shadow-lg shadow-lime-400/10 transition duration-300 group-hover:rotate-6">
              🏸
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-wider">
                Rudhran
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-lime-400">
                Badminton Club
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full px-4 py-2 text-xs font-bold text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-12 md:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left panel */}
          <div className="relative hidden overflow-hidden bg-[#11171a] p-10 lg:block">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-[90px]" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black">
                  🔐
                </div>

                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                  Club Administration
                </p>

                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight">
                  Manage the club.
                  <br />
                  <span className="text-white/30">
                    Keep things moving.
                  </span>
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-white/40">
                  Access the administration panel to manage members, verify
                  payments and keep the Rudhran Badminton Club running
                  smoothly.
                </p>
              </div>

              <div className="mt-12 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-black">
                    👥
                  </span>

                  <div>
                    <p className="text-xs font-black">Member Management</p>
                    <p className="mt-1 text-[10px] text-white/30">
                      View and manage club members
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 text-black">
                    ₹
                  </span>

                  <div>
                    <p className="text-xs font-black">Payment Verification</p>
                    <p className="mt-1 text-[10px] text-white/30">
                      Verify membership payments
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-white/10 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                  RUDHRAN BADMINTON CLUB
                </p>

                <p className="mt-2 text-xs text-white/25">
                  Train • Play • Improve
                </p>
              </div>
            </div>
          </div>

          {/* Login panel */}
          <div className="bg-white p-7 text-black sm:p-10 md:p-12">
            <div className="mx-auto max-w-md">
              {/* Mobile brand */}
              <div className="mb-8 lg:hidden">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl">
                  🔐
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-600">
                  Club Administration
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
                  Secure Access
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-tight">
                  Admin Login
                </h2>

                <p className="mt-3 text-sm leading-6 text-black/45">
                  Sign in to access the Rudhran club administration panel.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-9 space-y-5">
                {/* Mobile number */}
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="mb-2 block text-[11px] font-black uppercase tracking-wider text-black/50"
                  >
                    Mobile Number
                  </label>

                  <input
                    id="mobileNumber"
                    type="tel"
                    value={mobileNumber}
                    onChange={(event) =>
                      setMobileNumber(event.target.value)
                    }
                    placeholder="Enter admin mobile number"
                    required
                    autoComplete="username"
                    className="w-full rounded-2xl border border-black/10 bg-[#f5f6f2] px-4 py-4 text-sm font-semibold outline-none transition placeholder:text-black/25 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[11px] font-black uppercase tracking-wider text-black/50"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter admin password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-black/10 bg-[#f5f6f2] px-4 py-4 pr-20 text-sm font-semibold outline-none transition placeholder:text-black/25 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-wider text-black/35 transition hover:text-black"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {message && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs font-bold leading-5 text-red-600">
                      {message}
                    </p>
                  </div>
                )}

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-5 py-4 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#171c1f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      SIGN IN TO ADMIN
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Security note */}
              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#f5f6f2] p-4">
                <span className="mt-0.5 text-sm">🔒</span>

                <p className="text-[10px] font-semibold leading-5 text-black/40">
                  This area is restricted to authorized Rudhran Badminton
                  Club administrators.
                </p>
              </div>

              {/* Back links */}
              <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-6">
                <Link
                  href="/"
                  className="text-xs font-bold text-black/35 transition hover:text-black"
                >
                  ← Back to Home
                </Link>

                <Link
                  href="/login/member"
                  className="text-xs font-bold text-black/35 transition hover:text-lime-600"
                >
                  Member Login →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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