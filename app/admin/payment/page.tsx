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
  isActive: boolean;
};

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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            💳 Payment Management
          </h1>

          <p className="mt-2 text-slate-400">
            Track membership fees and payment status.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Total Members */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-3 text-3xl">👥</div>

            <p className="text-sm font-medium text-slate-400">
              Total Members
            </p>

            <p className="mt-1 text-3xl font-bold">
              {members.length}
            </p>
          </div>

          {/* Paid Members */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-3 text-3xl">✅</div>

            <p className="text-sm font-medium text-slate-400">
              Paid Members
            </p>

            <p className="mt-1 text-3xl font-bold text-green-400">
              {paidMembers.length}
            </p>
          </div>

          {/* Pending Members */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-3 text-3xl">⏳</div>

            <p className="text-sm font-medium text-slate-400">
              Pending Members
            </p>

            <p className="mt-1 text-3xl font-bold text-yellow-400">
              {pendingMembers.length}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-300">
              Loading members...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="font-medium text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Members Table */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-800 bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                      ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                      Member
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                      Mobile
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                      Batch
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                      Fee
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                      Member Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="transition hover:bg-slate-800/40"
                    >
                      {/* ID */}
                      <td className="px-6 py-5 font-medium text-slate-300">
                        #{member.id}
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
                      <td className="px-6 py-5 text-slate-300">
                        {member.mobileNumber}
                      </td>

                      {/* Batch */}
                      <td className="px-6 py-5">
                        <span className="font-semibold text-blue-400">
                          {member.batch}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="px-6 py-5">
                        {member.feeAmount !== null ? (
                          <span className="font-bold text-white">
                            ₹{member.feeAmount}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            Not entered
                          </span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-5">
                        {member.paymentStatus === "PAID" ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                            PAID
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
                            PENDING
                          </span>
                        )}
                      </td>

                      {/* Member Status */}
                      <td className="px-6 py-5">
                        {member.isActive ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">
                        {member.paymentStatus === "PAID" ? (
                          <span className="font-bold text-green-400">
                            ✓ Payment Verified
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              markAsPaid(
                                member.id,
                                member.fullName
                              )
                            }
                            className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-green-400"
                          >
                            💰 Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <a
            href="/admin"
            className="inline-flex items-center rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}