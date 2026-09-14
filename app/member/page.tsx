"use client";

import Link from "next/link";
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

export default function MemberDashboard() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMember() {
      try {
        const params = new URLSearchParams(window.location.search);
        const memberId = params.get("memberId");

        if (!memberId) {
          setError("Member information is missing.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/members");
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to load member details.");
          setLoading(false);
          return;
        }

        const foundMember = data.members.find(
          (item: Member) => String(item.id) === memberId
        );

        if (!foundMember) {
          setError("Member not found.");
          setLoading(false);
          return;
        }

        setMember(foundMember);
      } catch (error) {
        console.error("Failed to load member:", error);
        setError("Unable to load member dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadMember();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-5xl">🏸</div>
          <p className="mt-4 text-slate-400">
            Loading Member Dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error || !member) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <p className="font-medium text-red-400">
            {error || "Member information not found."}
          </p>
        </div>
      </main>
    );
  }

  const paymentVerified = member.paymentStatus === "PAID";
  const paymentSubmitted = member.paymentSubmitted === true;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              RUDHRAN BADMINTON CLUB
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome, {member.fullName} 👋
            </h1>

            <p className="mt-2 text-slate-400">
              Your membership dashboard
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
          >
            ← Home
          </Link>
        </div>

        {/* Membership Status */}
        <div
          className={`mb-6 rounded-2xl border p-6 ${
            paymentVerified
              ? "border-green-400/30 bg-green-400/10"
              : paymentSubmitted
                ? "border-yellow-400/30 bg-yellow-400/10"
                : "border-red-400/30 bg-red-400/10"
          }`}
        >
          <p className="text-sm text-slate-400">
            Membership Status
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              paymentVerified
                ? "text-green-400"
                : paymentSubmitted
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {paymentVerified
              ? "✓ Payment Verified"
              : paymentSubmitted
                ? "⏳ Payment Submitted - Waiting for Admin"
                : "⚠ Payment Pending"}
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Member Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-400">
              👤 Member Information
            </h2>

            <div className="mt-6 space-y-4">

              <div>
                <p className="text-sm text-slate-500">
                  Full Name
                </p>
                <p className="mt-1 font-semibold">
                  {member.fullName}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Mobile Number
                </p>
                <p className="mt-1 font-semibold">
                  {member.mobileNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>
                <p className="mt-1 font-semibold">
                  {member.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Training Batch
                </p>
                <p className="mt-1 font-semibold">
                  {member.batch}
                </p>
              </div>

            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-400">
              💰 Payment Information
            </h2>

            <div className="mt-6 space-y-5">

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <p className="text-sm text-slate-500">
                  Membership Fee
                </p>

                <p className="mt-2 text-3xl font-bold text-cyan-400">
                  ₹{member.feeAmount ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Payment Status
                </p>

                <p
                  className={`mt-1 font-bold ${
                    paymentVerified
                      ? "text-green-400"
                      : paymentSubmitted
                        ? "text-yellow-400"
                        : "text-yellow-400"
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
                <p className="text-sm text-slate-500">
                  Account Status
                </p>

                <p
                  className={`mt-1 font-bold ${
                    member.isActive
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {member.isActive ? "ACTIVE" : "NOT ACTIVE"}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Payment Action */}
        {!paymentVerified && !paymentSubmitted && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
            <h2 className="text-xl font-bold">
              Complete Membership Payment
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Pay your membership fee and submit the payment for admin
              verification.
            </p>

            <Link
              href={`/payment?memberId=${member.id}`}
              className="mt-5 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
            >
              💳 Go to Payment
            </Link>
          </div>
        )}

        {/* Waiting for Admin */}
        {!paymentVerified && paymentSubmitted && (
          <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-center">
            <p className="text-3xl">⏳</p>

            <h2 className="mt-2 text-xl font-bold text-yellow-400">
              Waiting for Admin Verification
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your payment has been submitted successfully.
              The admin will verify your payment and activate your membership.
            </p>
          </div>
        )}

        {/* Active Membership */}
        {paymentVerified && (
          <div className="mt-6 rounded-2xl border border-green-400/30 bg-green-400/10 p-6 text-center">
            <p className="text-3xl">🏸</p>

            <h2 className="mt-2 text-xl font-bold text-green-400">
              Membership Active
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your payment has been verified by the admin.
              Welcome to Rudhran Badminton Club!
            </p>
          </div>
        )}

      </div>
    </main>
  );
}