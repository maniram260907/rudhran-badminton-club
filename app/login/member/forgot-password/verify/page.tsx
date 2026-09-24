"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyCode() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const memberId = searchParams.get("memberId");

  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!verificationCode.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    if (!memberId) {
      setError("Invalid reset request.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/member/verify-forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
          verificationCode: verificationCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid verification code.");
        return;
      }

      router.push(
        `/login/member/forgot-password/reset?memberId=${memberId}`
      );
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-6xl">🔑</div>

          <h1 className="mt-4 text-3xl font-bold">
            Verify Code
          </h1>

          <p className="mt-2 text-slate-400">
            Enter the verification code sent to your email
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-xl tracking-[0.3em] text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <Link
              href="/login/member/forgot-password"
              className="block text-center text-sm text-cyan-400 hover:text-cyan-300"
            >
              ← Back
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}