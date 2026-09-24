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

export default function ManageMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

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

  const filteredMembers = members.filter((member) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      member.fullName.toLowerCase().includes(search) ||
      member.mobileNumber.toLowerCase().includes(search) ||
      (member.email ?? "").toLowerCase().includes(search)
    );
  });

  function handleSearchOpen() {
    setShowSearch(true);
  }

  function handleSearchClose() {
    setSearchTerm("");
    setShowSearch(false);
  }

  async function handleVerifyPayment(member: Member) {
    const confirmed = window.confirm(
      `Verify payment for ${member.fullName} (#${member.id})?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setVerifyingId(member.id);
      setError("");

      const response = await fetch("/api/members", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: member.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to verify payment.");
        return;
      }

      setMembers((previousMembers) =>
        previousMembers.map((previousMember) =>
          previousMember.id === member.id
            ? {
                ...previousMember,
                paymentStatus: "PAID",
                isActive: true,
              }
            : previousMember
        )
      );
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Unable to verify payment.");
    } finally {
      setVerifyingId(null);
    }
  }

  async function handleDelete(member: Member) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.fullName} (#${member.id})?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(member.id);
      setError("");

      const response = await fetch("/api/members", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: member.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to delete member.");
        return;
      }

      setMembers((previousMembers) =>
        previousMembers.filter(
          (previousMember) => previousMember.id !== member.id
        )
      );
    } catch (error) {
      console.error("Error deleting member:", error);
      setError("Unable to delete member.");
    } finally {
      setDeletingId(null);
    }
  }

  const totalMembers = members.length;

  const paidMembers = members.filter(
    (member) => member.paymentStatus === "PAID"
  ).length;

  const pendingMembers = members.filter(
    (member) => member.paymentStatus !== "PAID"
  ).length;

  const activeMembers = members.filter(
    (member) => member.isActive
  ).length;

  return (
    <main className="min-h-screen bg-[#070b0d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-lime-400/5 blur-[130px]" />

        <div className="absolute -right-40 top-[500px] h-96 w-96 rounded-full bg-yellow-400/5 blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:45px_45px]" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-white/10 bg-[#070b0d]/90 backdrop-blur-xl">
        <div className="w-full px-5 py-4 md:px-8">
          <div className="flex items-center justify-between gap-5">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/admin";
              }}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 text-xl text-black shadow-lg shadow-lime-400/10">
                🏸
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-wider">
                  Rudhran
                </p>

                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-lime-400">
                  Member Management
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/admin";
              }}
              className="rounded-full border border-white/10 px-4 py-2.5 text-xs font-black text-white/60 transition hover:border-lime-400/30 hover:bg-white/5 hover:text-lime-300"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="relative z-10 w-full px-5 py-8 md:px-8 md:py-10">
        {/* PAGE INTRO */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-lime-400" />

                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-lime-400">
                  Club Administration
                </p>
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Club Members
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                View registered members, verify payments and manage active
                club accounts.
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              {!showSearch ? (
                <button
                  type="button"
                  onClick={handleSearchOpen}
                  aria-label="Open member search"
                  className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-5 text-sm font-bold text-white/60 transition hover:border-lime-400/30 hover:bg-white/[0.07] hover:text-lime-300"
                >
                  <span className="text-lg">⌕</span>
                  Search Members
                </button>
              ) : (
                <>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/30">
                      ⌕
                    </span>

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name, mobile or email..."
                      autoFocus
                      className="h-12 w-72 rounded-2xl border border-lime-400/30 bg-white/[0.05] pl-11 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/25 focus:border-lime-400/60"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSearchClose}
                    aria-label="Close member search"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-lg text-white/50 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-400"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                Total
              </p>

              <span className="text-lg">👥</span>
            </div>

            <p className="mt-4 text-3xl font-black">{totalMembers}</p>

            <p className="mt-1 text-[10px] font-semibold text-white/25">
              Registered members
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-lime-400/10 bg-lime-400/[0.035] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                Paid
              </p>

              <span className="text-lg text-lime-400">✓</span>
            </div>

            <p className="mt-4 text-3xl font-black text-lime-400">
              {paidMembers}
            </p>

            <p className="mt-1 text-[10px] font-semibold text-white/25">
              Payment verified
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-yellow-400/10 bg-yellow-400/[0.035] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                Pending
              </p>

              <span className="text-lg text-yellow-400">⏳</span>
            </div>

            <p className="mt-4 text-3xl font-black text-yellow-300">
              {pendingMembers}
            </p>

            <p className="mt-1 text-[10px] font-semibold text-white/25">
              Need verification
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-blue-400/10 bg-blue-400/[0.035] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                Active
              </p>

              <span className="text-lg text-blue-300">🏸</span>
            </div>

            <p className="mt-4 text-3xl font-black text-blue-300">
              {activeMembers}
            </p>

            <p className="mt-1 text-[10px] font-semibold text-white/25">
              Active accounts
            </p>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
            <div className="flex items-start gap-3">
              <span className="text-lg text-red-400">!</span>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-red-400">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-300/70">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-2xl text-black">
              🏸
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Loading members
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredMembers.length === 0 && (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl">
              👥
            </div>

            <h3 className="mt-5 text-xl font-black">
              {searchTerm ? "No Matching Members" : "No Members Found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
              {searchTerm
                ? "Try searching with a different name, mobile number or email."
                : "No members have registered with the club yet."}
            </p>
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && filteredMembers.length > 0 && (
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
            {/* Table heading */}
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 px-6 py-5 md:flex-row md:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25">
                  Member Directory
                </p>

                <h2 className="mt-1 text-lg font-black">
                  {searchTerm
                    ? `${filteredMembers.length} matching members`
                    : `${filteredMembers.length} registered members`}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-400" />

                <span className="text-[10px] font-black uppercase tracking-wider text-lime-300">
                  Live
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1500px]">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20">
                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      ID
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      Member
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      Mobile
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      Training Batch
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      Fee
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      Account
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-white/30">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.025]"
                    >
                      {/* ID */}
                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-black text-white/40">
                          #{member.id}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-xs font-black text-lime-300">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="whitespace-nowrap text-sm font-bold text-white">
                              {member.fullName}
                            </p>

                            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/20">
                              Club Member
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-6 py-5">
                        <p className="whitespace-nowrap text-sm font-semibold text-white/60">
                          {member.mobileNumber}
                        </p>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-5">
                        <p className="max-w-[220px] truncate text-sm text-white/50">
                          {member.email || "Not provided"}
                        </p>
                      </td>

                      {/* Batch */}
                      <td className="px-6 py-5">
                        <span className="inline-flex max-w-[280px] rounded-xl border border-blue-400/10 bg-blue-400/[0.06] px-3 py-2 text-xs font-semibold leading-5 text-blue-300">
                          {getBatchLabel(member.batch)}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="px-6 py-5">
                        <p className="whitespace-nowrap text-sm font-black text-white">
                          {member.feeAmount !== null
                            ? `₹${member.feeAmount}`
                            : "Not paid"}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-5">
                        {member.paymentStatus === "PAID" ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/10 bg-lime-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-lime-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/10 bg-yellow-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-yellow-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Account */}
                      <td className="px-6 py-5">
                        {member.isActive ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/10 bg-blue-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex min-w-[250px] flex-wrap gap-2">
                          {member.paymentStatus !== "PAID" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleVerifyPayment(member)
                              }
                              disabled={verifyingId === member.id}
                              className="rounded-xl border border-lime-400/10 bg-lime-400/[0.07] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-lime-300 transition hover:border-lime-400/25 hover:bg-lime-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {verifyingId === member.id
                                ? "Verifying..."
                                : "✓ Mark as Paid"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(member)}
                            disabled={deletingId === member.id}
                            className="rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-red-400 transition hover:border-red-400/25 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId === member.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex flex-col justify-between gap-3 border-t border-white/10 bg-black/10 px-6 py-4 sm:flex-row sm:items-center">
              <p className="text-[10px] font-semibold text-white/25">
                Showing{" "}
                <span className="font-black text-white/50">
                  {filteredMembers.length}
                </span>{" "}
                of{" "}
                <span className="font-black text-white/50">
                  {members.length}
                </span>{" "}
                members
              </p>

              {searchTerm && (
                <button
                  type="button"
                  onClick={handleSearchClose}
                  className="text-[10px] font-black uppercase tracking-wider text-lime-300 transition hover:text-lime-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </section>
        )}

        {/* BACK BUTTON */}
        <div className="mt-7">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/admin";
            }}
            className="rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-xs font-black text-white/50 transition hover:border-lime-400/25 hover:bg-white/[0.06] hover:text-lime-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* FOOTER */}
        <footer className="mt-12 border-t border-white/10 py-7">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-wider">
                🏸 Rudhran Badminton Club
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                Train • Play • Improve
              </p>
            </div>

            <p className="text-[10px] text-white/20">
              Member Management • 2026
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}