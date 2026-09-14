"use client";

import { FormEvent, useState } from "react";

export default function MemberRegistration() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = formData.get("fullName") as string;
    const mobileNumber = formData.get("mobileNumber") as string;
    const email = formData.get("email") as string;
    const batch = formData.get("batch") as string;
    const feeAmount = formData.get("feeAmount") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          email,
          batch,
          feeAmount,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      window.location.href = `/payment?memberId=${data.memberId}`;
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="text-6xl">🏸</div>

          <h1 className="mt-4 text-3xl font-bold">
            Join Rudhran Badminton Club
          </h1>

          <p className="mt-2 text-slate-400">
            Create your member account
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-cyan-400">
                Personal Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Enter your mobile number"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                    <span className="ml-2 text-slate-500">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Batch Selection */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-cyan-400">
                Training Batch
              </h2>

              <label className="mb-2 block text-sm font-medium">
                Select your batch
              </label>

              <select
                name="batch"
                required
                defaultValue=""
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="" disabled>
                  Select a batch
                </option>

                <option value="morning">
                  🌅 Morning Batch
                </option>

                <option value="evening">
                  🌆 Evening Batch
                </option>
              </select>
            </div>

            {/* Fee Amount */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-cyan-400">
                Membership Fee
              </h2>

              <label className="mb-2 block text-sm font-medium">
                Fee Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ₹
                </span>

                <input
                  type="number"
                  name="feeAmount"
                  placeholder="Enter fee amount"
                  min="1"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 outline-none focus:border-cyan-400"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Enter the membership fee amount you are going to pay.
              </p>
            </div>

            {/* Account Details */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-cyan-400">
                Account Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-center text-cyan-300">
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 py-4 font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Registering..." : "Continue to Payment"}
            </button>

            <p className="text-center text-xs text-slate-500">
              Your account will be activated after successful payment.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}