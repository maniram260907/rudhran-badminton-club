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
  createdAt: string;
};

export default function ManageMembers() {
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-2xl font-bold">
            🏸 Rudhran Badminton Club
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage Members
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            👥 Club Members
          </h2>

          <p className="mt-2 text-slate-400">
            View and manage all registered club members.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="text-5xl">🏸</div>

            <p className="mt-4 text-slate-400">
              Loading members...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-800 bg-red-950/40 p-6">
            <p className="font-semibold text-red-400">
              ❌ {error}
            </p>
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="text-5xl">👥</div>

            <h3 className="mt-4 text-xl font-bold">
              No Members Found
            </h3>

            <p className="mt-2 text-slate-400">
              No members have registered yet.
            </p>
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-slate-800 bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Mobile
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Batch
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Fee
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-slate-800 transition hover:bg-slate-800/50"
                    >
                      <td className="px-6 py-5 text-slate-400">
                        #{member.id}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {member.fullName}
                      </td>

                      <td className="px-6 py-5 text-slate-300">
                        {member.mobileNumber}
                      </td>

                      <td className="px-6 py-5 text-slate-300">
                        {member.email || "Not provided"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400">
                          {member.batch}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {member.feeAmount !== null
                          ? `₹${member.feeAmount}`
                          : "Not paid"}
                      </td>

                      <td className="px-6 py-5">
                        {member.paymentStatus === "PAID" ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
                            PAID
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-400">
                            PENDING
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {member.isActive ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-500/10 px-3 py-1 text-sm font-semibold text-slate-400">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            window.location.href = "/admin";
          }}
          className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}