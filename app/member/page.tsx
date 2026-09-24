"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Member = {
  id: number;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  batch: string;
  feeAmount: number | null;
  paymentStatus: string;
  paymentSubmitted: boolean;
  isActive: boolean;
};

function getBatchLabel(batch: string) {
  switch (batch) {
    case "morning-5-6:30":
      return "🌅 Morning — 5:00 AM to 6:30 AM";

    case "morning-6:45-8:30":
      return "🌅 Morning — 6:45 AM to 8:30 AM";

    case "morning-9-10":
      return "🌅 Morning — 9:00 AM to 10:00 AM";

    case "night-beginners-5-6:30":
      return "🌙 Night — Beginners — 5:00 PM to 6:30 PM";

    case "night-advanced-6:45-8:30":
      return "🌙 Night — Advanced — 6:45 PM to 8:30 PM";

    case "night-1":
      return "🌙 Night — Batch 1";

    case "night-2":
      return "🌙 Night — Batch 2";

    default:
      return batch;
  }
}

export default function MemberDashboard() {
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadMember() {
      try {
        const response = await fetch("/api/member/me");
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to load member details.");
          setLoading(false);
          return;
        }

        setMember(data.member);
      } catch (error) {
        console.error("Failed to load member:", error);
        setError("Unable to load member dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadMember();
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/member/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to logout.");
        setLoggingOut(false);
        return;
      }

      router.push("/login/member");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Unable to logout. Please try again.");
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b0d] text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-3xl text-black shadow-[0_0_35px_rgba(163,230,53,0.15)]">
            🏸
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error || !member) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b0d] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-[#0d1316] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-400/10 text-2xl text-red-400">
            !
          </div>

          <h1 className="mt-5 text-xl font-black">
            Unable to Load Dashboard
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {error || "Member information not found."}
          </p>

          <Link
            href="/login/member"
            className="mt-6 inline-flex rounded-xl bg-lime-400 px-5 py-3 text-sm font-black text-black transition hover:bg-lime-300"
          >
            Back to Member Login
          </Link>
        </div>
      </main>
    );
  }

  const paymentVerified = member.paymentStatus === "PAID";
  const paymentSubmitted = member.paymentSubmitted === true;

  return (
    <main className="min-h-screen bg-[#070b0d] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#070b0d]/95">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 text-xl font-black text-black transition group-hover:scale-105">
              R
            </div>

            <div>
              <p className="text-sm font-black tracking-wide text-white">
                RUDHRAN
              </p>

              <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                BADMINTON CLUB
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-lime-400/30 hover:bg-white/5 hover:text-white sm:block"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        {/* Welcome */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-lime-400" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
              Member Dashboard
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Welcome, {member.fullName}
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Manage your Rudhran Badminton Club membership and payment
                status.
              </p>
            </div>

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                paymentVerified
                  ? "border-lime-400/20 bg-lime-400/10 text-lime-400"
                  : paymentSubmitted
                    ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                    : "border-red-400/20 bg-red-400/10 text-red-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  paymentVerified
                    ? "bg-lime-400"
                    : paymentSubmitted
                      ? "bg-yellow-400"
                      : "bg-red-400"
                }`}
              />

              {paymentVerified
                ? "MEMBERSHIP ACTIVE"
                : paymentSubmitted
                  ? "PAYMENT UNDER REVIEW"
                  : "PAYMENT PENDING"}
            </div>
          </div>
        </section>

        {/* Membership Status */}
        <section
          className={`mb-6 overflow-hidden rounded-3xl border ${
            paymentVerified
              ? "border-lime-400/20 bg-lime-400/[0.045]"
              : paymentSubmitted
                ? "border-yellow-400/20 bg-yellow-400/[0.045]"
                : "border-red-400/20 bg-red-400/[0.045]"
          }`}
        >
          <div className="flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Membership Status
              </p>

              <h2
                className={`mt-2 text-2xl font-black ${
                  paymentVerified
                    ? "text-lime-400"
                    : paymentSubmitted
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {paymentVerified
                  ? "✓ Payment Verified"
                  : paymentSubmitted
                    ? "⏳ Payment Submitted — Waiting for Admin"
                    : "⚠ Payment Pending"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {paymentVerified
                  ? "Your payment has been verified and your club membership is active."
                  : paymentSubmitted
                    ? "Your payment reference has been submitted and is waiting for admin verification."
                    : "Complete your membership payment to activate your account."}
              </p>
            </div>

            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                paymentVerified
                  ? "bg-lime-400/10"
                  : paymentSubmitted
                    ? "bg-yellow-400/10"
                    : "bg-red-400/10"
              }`}
            >
              {paymentVerified ? "✓" : paymentSubmitted ? "⏳" : "!"}
            </div>
          </div>
        </section>

        {/* Main Information */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Member Information */}
          <section className="rounded-3xl border border-white/10 bg-[#0d1316] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                  Profile
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Member Information
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-xl">
                👤
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Full Name
                </p>

                <p className="mt-1 font-semibold text-white">
                  {member.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Mobile Number
                </p>

                <p className="mt-1 font-semibold text-white">
                  {member.mobileNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email
                </p>

                <p className="mt-1 break-all font-semibold text-white">
                  {member.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Training Batch
                </p>

                <div className="mt-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-200">
                    {getBatchLabel(member.batch)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className="rounded-3xl border border-white/10 bg-[#0d1316] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                  Membership
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Payment Information
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-xl">
                ₹
              </div>
            </div>

            <div className="mt-6">
              <div className="rounded-2xl border border-lime-400/10 bg-lime-400/[0.035] p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Membership Fee
                </p>

                <p className="mt-2 text-4xl font-black text-lime-400">
                  ₹{member.feeAmount ?? 0}
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Payment Status
                  </p>

                  <p
                    className={`mt-2 text-sm font-black ${
                      paymentVerified
                        ? "text-lime-400"
                        : paymentSubmitted
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {paymentVerified
                      ? "PAID"
                      : paymentSubmitted
                        ? "PAYMENT SUBMITTED"
                        : "PENDING"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Account Status
                  </p>

                  <p
                    className={`mt-2 text-sm font-black ${
                      member.isActive
                        ? "text-lime-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {member.isActive ? "ACTIVE" : "NOT ACTIVE"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Payment Action */}
        {!paymentVerified && !paymentSubmitted && (
          <section className="mt-6 rounded-3xl border border-yellow-400/15 bg-yellow-400/[0.035] p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                  Action Required
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Complete Membership Payment
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Pay your membership fee and submit your payment reference
                  for admin verification.
                </p>
              </div>

              <Link
                href="/payment"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(163,230,53,0.15)]"
              >
                💳 Go to Payment
              </Link>
            </div>
          </section>
        )}

        {/* Waiting for Admin */}
        {!paymentVerified && paymentSubmitted && (
          <section className="mt-6 rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.035] p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-2xl">
              ⏳
            </div>

            <h2 className="mt-5 text-xl font-black text-yellow-400">
              Waiting for Admin Verification
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Your payment has been submitted successfully. The admin will
              verify your payment and activate your membership.
            </p>
          </section>
        )}

        {/* Active Membership */}
        {paymentVerified && (
          <section className="mt-6 rounded-3xl border border-lime-400/20 bg-lime-400/[0.035] p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-2xl">
              🏸
            </div>

            <h2 className="mt-5 text-xl font-black text-lime-400">
              Membership Active
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Your payment has been verified by the admin. Welcome to
              Rudhran Badminton Club!
            </p>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm font-bold text-slate-400">
            RUDHRAN BADMINTON CLUB
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Train hard. Play smart. Stay consistent.
          </p>
        </footer>
      </div>
    </main>
  );
}