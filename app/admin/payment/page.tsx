"use client";

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
  paymentReference: string | null;
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

export default function PaymentManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await fetch("/api/members");
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to load members.");
          return;
        }

        setMembers(data.members);
      } catch (error) {
        console.error("Error loading members:", error);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  async function markAsPaid(memberId: number, memberName: string) {
    try {
      const response = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to verify payment.");
        return;
      }

      setMembers((currentMembers) =>
        currentMembers.map((member) =>
          member.id === memberId
            ? {
                ...member,
                paymentStatus: "PAID",
                paymentSubmitted: true,
                isActive: true,
              }
            : member
        )
      );

      alert(`${memberName}'s payment has been marked as PAID.`);
    } catch (error) {
      console.error("Failed to mark payment as paid:", error);
      alert("Unable to verify payment. Please try again.");
    }
  }

  const paidMembers = members.filter(
    (member) => member.paymentStatus === "PAID"
  );

  const pendingMembers = members.filter(
    (member) => member.paymentStatus !== "PAID"
  );

  const submittedMembers = members.filter(
    (member) =>
      member.paymentStatus !== "PAID" && member.paymentSubmitted
  );

  return (
    <main className="min-h-screen bg-[#070b0d] text-white">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-[#070b0d]/95">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-5 lg:px-10">
          <a href="/admin" className="group flex items-center gap-3">
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
          </a>

          <a
            href="/admin"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-lime-400/40 hover:bg-white/5 hover:text-white"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1600px] px-6 py-10 lg:px-10 lg:py-12">
        {/* Page Heading */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-lime-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
              Admin / Payments
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Payment Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Review membership payments, verify submitted references, and
                activate members after successful payment verification.
              </p>
            </div>

            <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-lime-400">
                Payment Overview
              </p>
              <p className="mt-1 text-2xl font-black text-white">
                {paidMembers.length}/{members.length}
              </p>
              <p className="text-xs text-slate-500">
                members verified
              </p>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1316] p-6 transition hover:border-white/20">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl">
                👥
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Members
              </span>
            </div>

            <p className="text-sm font-medium text-slate-400">
              Total Members
            </p>

            <p className="mt-1 text-3xl font-black text-white">
              {members.length}
            </p>
          </div>

          {/* Paid */}
          <div className="rounded-2xl border border-lime-400/15 bg-[#0d1316] p-6 transition hover:border-lime-400/30">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-xl">
                ✓
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                Verified
              </span>
            </div>

            <p className="text-sm font-medium text-slate-400">
              Paid Members
            </p>

            <p className="mt-1 text-3xl font-black text-lime-400">
              {paidMembers.length}
            </p>
          </div>

          {/* Submitted */}
          <div className="rounded-2xl border border-cyan-400/15 bg-[#0d1316] p-6 transition hover:border-cyan-400/30">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                ↗
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Review
              </span>
            </div>

            <p className="text-sm font-medium text-slate-400">
              Submitted
            </p>

            <p className="mt-1 text-3xl font-black text-cyan-400">
              {submittedMembers.length}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-yellow-400/15 bg-[#0d1316] p-6 transition hover:border-yellow-400/30">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-xl">
                ⏳
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                Pending
              </span>
            </div>

            <p className="text-sm font-medium text-slate-400">
              Pending Members
            </p>

            <p className="mt-1 text-3xl font-black text-yellow-400">
              {pendingMembers.length}
            </p>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#0d1316] p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-lime-400" />

            <p className="font-medium text-slate-300">
              Loading payment records...
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Please wait while the member data is loaded.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="mb-3 text-3xl">!</div>

            <p className="font-semibold text-red-400">
              {error}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Please refresh the page and try again.
            </p>
          </div>
        )}

        {/* Payment Records */}
        {!loading && !error && (
          <section>
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black">
                  Payment Records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review and verify member payment submissions.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-400">
                {members.length} records
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1316]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1450px] text-left">
                  <thead className="border-b border-white/10 bg-white/[0.025]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        ID
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Member
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Mobile
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Batch
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Fee
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Reference
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Account
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        {/* ID */}
                        <td className="px-6 py-5">
                          <span className="font-mono text-sm font-bold text-slate-500">
                            #{member.id}
                          </span>
                        </td>

                        {/* Member */}
                        <td className="px-6 py-5">
                          <div className="font-bold text-white">
                            {member.fullName}
                          </div>

                          {member.email && (
                            <div className="mt-1 text-xs text-slate-500">
                              {member.email}
                            </div>
                          )}
                        </td>

                        {/* Mobile */}
                        <td className="px-6 py-5 text-sm text-slate-300">
                          {member.mobileNumber}
                        </td>

                        {/* Batch */}
                        <td className="max-w-[250px] px-6 py-5">
                          <span className="text-sm font-semibold text-slate-300">
                            {getBatchLabel(member.batch)}
                          </span>
                        </td>

                        {/* Fee */}
                        <td className="px-6 py-5">
                          {member.feeAmount !== null ? (
                            <span className="font-black text-white">
                              ₹{member.feeAmount}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-600">
                              Not entered
                            </span>
                          )}
                        </td>

                        {/* Payment Status */}
                        <td className="px-6 py-5">
                          {member.paymentStatus === "PAID" ? (
                            <span className="inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold text-lime-400">
                              PAID
                            </span>
                          ) : member.paymentSubmitted ? (
                            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
                              SUBMITTED
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                              PENDING
                            </span>
                          )}
                        </td>

                        {/* Reference */}
                        <td className="px-6 py-5">
                          {member.paymentReference ? (
                            <span className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs font-bold text-cyan-300">
                              {member.paymentReference}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-600">
                              Not submitted
                            </span>
                          )}
                        </td>

                        {/* Account Status */}
                        <td className="px-6 py-5">
                          {member.isActive ? (
                            <span className="inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold text-lime-400">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-bold text-red-400">
                              INACTIVE
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5">
                          {member.paymentStatus === "PAID" ? (
                            <div className="flex items-center gap-2 text-sm font-bold text-lime-400">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400/10">
                                ✓
                              </span>

                              Payment Verified
                            </div>
                          ) : member.paymentSubmitted ? (
                            <button
                              onClick={() =>
                                markAsPaid(
                                  member.id,
                                  member.fullName
                                )
                              }
                              className="rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-black text-black transition hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.15)]"
                            >
                              ✓ Mark as Paid
                            </button>
                          ) : (
                            <span className="text-sm font-medium text-slate-600">
                              Payment Not Submitted
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {members.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-6 py-16 text-center"
                        >
                          <div className="text-4xl">💳</div>

                          <p className="mt-4 font-bold text-white">
                            No payment records found
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Payment information will appear here when members
                            register.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Bottom Navigation */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-300">
              Rudhran Badminton Club
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Payment verification management
            </p>
          </div>

          <a
            href="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-lime-400/30 hover:bg-white/5 hover:text-white"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}