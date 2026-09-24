"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getBatchLabel(batch: string) {
  switch (batch) {
    case "morning-5-6:30":
      return "🌅 Morning — 5:00 AM to 6:30 AM";

    case "morning-6:45-8:30":
      return "🌅 Morning — 6:45 AM to 8:30 AM";

    case "morning-9-10":
      return "🌅 Morning — 9:00 AM to 10:00 AM";

    case "night-beginners-5-6:30":
      return "🌙 Night — Team B — 5:00 PM to 6:30 PM";

    case "night-advanced-6:45-8:30":
      return "🌙 Night — Team A — 6:45 PM to 8:30 PM";

    default:
      return batch;
  }
}

const batches = [
  "morning-5-6:30",
  "morning-6:45-8:30",
  "morning-9-10",
  "night-beginners-5-6:30",
  "night-advanced-6:45-8:30",
];

export default function MemberRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [batch, setBatch] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!mobileNumber.trim()) {
      setMessage("Please enter your mobile number.");
      return;
    }

    if (!batch) {
      setMessage("Please select your batch.");
      return;
    }

    if (!feeAmount.trim()) {
      setMessage("Please enter the fee amount.");
      return;
    }

    if (!password) {
      setMessage("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          mobileNumber: mobileNumber.trim(),
          email: email.trim() || null,
          batch,
          feeAmount: Number(feeAmount),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage("Registration successful! Redirecting to payment...");

      setTimeout(() => {
        router.push(`/payment?memberId=${data.memberId}`);
      }, 800);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b0d] px-5 py-10 text-white sm:px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-400/5 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-2xl">

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

        {/* Main Card */}
        <div className="animate-[fadeIn_0.6s_ease-out] rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/30 sm:p-9">

          {/* Heading */}
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-600">
              Membership
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Join the club 🏸
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Create your member account, choose your training batch, and
              complete the payment to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Information */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-100 text-sm">
                  01
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900">
                    Personal Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Tell us a little about yourself
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  />
                </div>

                {/* Mobile */}
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

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email{" "}
                    <span className="font-medium text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  />
                </div>
              </div>
            </div>

            {/* Training Information */}
            <div className="border-t border-slate-100 pt-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-100 text-sm">
                  02
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900">
                    Training Details
                  </h2>

                  <p className="text-xs text-slate-400">
                    Choose your preferred training schedule
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                {/* Batch */}
                <div>
                  <label
                    htmlFor="batch"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Training Batch
                  </label>

                  <select
                    id="batch"
                    value={batch}
                    onChange={(event) => setBatch(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  >
                    <option value="">Select your batch</option>

                    {batches.map((batchValue) => (
                      <option key={batchValue} value={batchValue}>
                        {getBatchLabel(batchValue)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fee */}
                <div>
                  <label
                    htmlFor="feeAmount"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Fee Amount
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      ₹
                    </span>

                    <input
                      id="feeAmount"
                      type="number"
                      value={feeAmount}
                      onChange={(event) => setFeeAmount(event.target.value)}
                      placeholder="Enter fee amount"
                      min="0"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="border-t border-slate-100 pt-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-100 text-sm">
                  03
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900">
                    Account Security
                  </h2>

                  <p className="text-xs text-slate-400">
                    Create a password for your account
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-400/10"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-medium leading-5 ${
                  message.toLowerCase().includes("successful")
                    ? "border-lime-200 bg-lime-50 text-lime-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-2xl bg-lime-400 px-4 py-4 font-black text-slate-950 shadow-lg shadow-lime-400/10 transition hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Member Account
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?
            </p>

            <button
              type="button"
              onClick={() => router.push("/login/member")}
              className="mt-1 font-black text-lime-700 transition hover:text-lime-600"
            >
              Login to your account →
            </button>
          </div>

          {/* Payment Information */}
          <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-center text-xs font-medium leading-5 text-yellow-800">
              💳 Your account will be activated after successful payment and
              admin verification.
            </p>
          </div>

          {/* Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-400 transition hover:text-slate-700"
            >
              ← Back to Rudhran Badminton Club
            </Link>
          </div>
        </div>

        {/* Bottom */}
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