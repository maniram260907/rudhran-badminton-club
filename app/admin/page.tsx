"use client";

import { useEffect, useState } from "react";

type Admin = {
  id: number;
  fullName: string;
  mobileNumber: string;
};

type Member = {
  id: number;
  fullName: string;
  mobileNumber: string;
  paymentStatus: string;
  isActive: boolean;
};

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const adminResponse = await fetch("/api/admin/auth");

        if (!adminResponse.ok) {
          window.location.href = "/login/admin";
          return;
        }

        const adminData = await adminResponse.json();

        if (!adminData.success) {
          window.location.href = "/login/admin";
          return;
        }

        setAdmin(adminData.admin);

        const membersResponse = await fetch("/api/members");
        const membersData = await membersResponse.json();

        if (membersData.success) {
          setMembers(membersData.members);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "/login/admin";
        return;
      }

      console.error("Logout failed:", data.message);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b0d] text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-3xl text-black shadow-lg shadow-lime-400/10">
            🏸
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Loading dashboard
            </p>
          </div>
        </div>
      </main>
    );
  }

  const totalMembers = members.length;

  const paidMembers = members.filter(
    (member) => member.paymentStatus === "PAID"
  ).length;

  const pendingMembers = members.filter(
    (member) => member.paymentStatus !== "PAID"
  ).length;

  const activeMembers = members.filter(
    (member) => member.isActive === true
  ).length;

  const inactiveMembers = members.filter(
    (member) => member.isActive !== true
  ).length;

  return (
    <main className="min-h-screen bg-[#070b0d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-lime-400/5 blur-[130px]" />

        <div className="absolute -right-40 top-[450px] h-96 w-96 rounded-full bg-yellow-400/5 blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:45px_45px]" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-white/10 bg-[#070b0d]/90 backdrop-blur-xl">
        <div className="w-full px-5 py-4 md:px-8">
          <div className="flex items-center justify-between gap-5">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 text-xl text-black shadow-lg shadow-lime-400/10">
                🏸
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-wider">
                  Rudhran
                </p>

                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-lime-400">
                  Admin Panel
                </p>
              </div>
            </div>

            {/* Admin info */}
            <div className="flex items-center gap-3 md:gap-5">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold">
                  {admin?.fullName || "Admin"}
                </p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
                  Administrator
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10 text-sm font-black text-yellow-300">
                {admin?.fullName?.charAt(0).toUpperCase() || "A"}
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full border border-red-400/20 px-4 py-2.5 text-xs font-black text-red-400 transition duration-300 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="relative z-10 w-full px-5 py-8 md:px-8 md:py-10">
        {/* Welcome */}
        <section className="mb-9">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-lime-400" />

                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-lime-400">
                  Club Administration
                </p>
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Welcome,{" "}
                <span className="text-lime-400">
                  {admin?.fullName || "Admin"}
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                Manage members, monitor payments and keep the Rudhran
                Badminton Club running smoothly.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 md:block">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                Dashboard Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.6)]" />

                <p className="text-xs font-bold text-lime-300">
                  System Active
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total */}
          <div className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                  👥
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                  Members
                </span>
              </div>

              <p className="mt-7 text-[11px] font-black uppercase tracking-wider text-white/35">
                Total Members
              </p>

              <p className="mt-2 text-4xl font-black text-white">
                {totalMembers}
              </p>

              <p className="mt-2 text-[10px] font-semibold text-white/25">
                Registered club members
              </p>
            </div>
          </div>

          {/* Paid */}
          <div className="group relative overflow-hidden rounded-[1.75rem] border border-lime-400/10 bg-lime-400/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-400/25">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-lime-400/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 text-xl text-black">
                  ✓
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-lime-400/40">
                  Verified
                </span>
              </div>

              <p className="mt-7 text-[11px] font-black uppercase tracking-wider text-white/35">
                Paid Fees
              </p>

              <p className="mt-2 text-4xl font-black text-lime-400">
                {paidMembers}
              </p>

              <p className="mt-2 text-[10px] font-semibold text-white/25">
                Payments verified
              </p>
            </div>
          </div>

          {/* Pending */}
          <div className="group relative overflow-hidden rounded-[1.75rem] border border-yellow-400/10 bg-yellow-400/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/25">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-yellow-400/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-xl text-black">
                  ⏳
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400/40">
                  Action
                </span>
              </div>

              <p className="mt-7 text-[11px] font-black uppercase tracking-wider text-white/35">
                Pending Fees
              </p>

              <p className="mt-2 text-4xl font-black text-yellow-300">
                {pendingMembers}
              </p>

              <p className="mt-2 text-[10px] font-semibold text-white/25">
                Awaiting verification
              </p>
            </div>
          </div>

          {/* Active */}
          <div className="group relative overflow-hidden rounded-[1.75rem] border border-blue-400/10 bg-blue-400/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/25">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-400/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400 text-xl text-black">
                  🏸
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-blue-300/40">
                  Active
                </span>
              </div>

              <p className="mt-7 text-[11px] font-black uppercase tracking-wider text-white/35">
                Active Members
              </p>

              <p className="mt-2 text-4xl font-black text-blue-300">
                {activeMembers}
              </p>

              <p className="mt-2 text-[10px] font-semibold text-white/25">
                Currently active accounts
              </p>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/25">
                Quick Actions
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Manage the club
              </h2>
            </div>

            <p className="hidden text-xs text-white/25 sm:block">
              Choose an area to manage
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Members */}
            <button
              onClick={() => {
                window.location.href = "/admin/members";
              }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-lime-400/25 hover:bg-white/[0.06] md:p-8"
            >
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-lime-400/5 blur-3xl transition group-hover:bg-lime-400/10" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-2xl text-black shadow-lg shadow-lime-400/10">
                    👥
                  </div>

                  <span className="text-2xl text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-lime-400">
                    →
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  Manage Members
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-white/40">
                  View registered members, check account status and manage
                  club membership information.
                </p>

                <div className="mt-7 flex items-center gap-3">
                  <span className="rounded-full bg-lime-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-lime-300">
                    {totalMembers} Members
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/30">
                    {activeMembers} Active
                  </span>
                </div>
              </div>
            </button>

            {/* Payments */}
            <button
              onClick={() => {
                window.location.href = "/admin/payment";
              }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-yellow-400/25 hover:bg-white/[0.06] md:p-8"
            >
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-yellow-400/5 blur-3xl transition group-hover:bg-yellow-400/10" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black shadow-lg shadow-yellow-400/10">
                    ₹
                  </div>

                  <span className="text-2xl text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-yellow-400">
                    →
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  Payment Management
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-white/40">
                  Review payment submissions, verify membership fees and
                  activate paid member accounts.
                </p>

                <div className="mt-7 flex items-center gap-3">
                  <span className="rounded-full bg-lime-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-lime-300">
                    {paidMembers} Verified
                  </span>

                  <span className="rounded-full bg-yellow-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-yellow-300">
                    {pendingMembers} Pending
                  </span>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* MEMBERSHIP OVERVIEW */}
        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/25">
                Membership Overview
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Club account status
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-lime-400/10 bg-lime-400/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-lime-400" />

              <span className="text-[10px] font-black uppercase tracking-wider text-lime-300">
                Live Data
              </span>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                  Active
                </p>

                <span className="text-lime-400">●</span>
              </div>

              <p className="mt-3 text-3xl font-black">
                {activeMembers}
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-lime-400 transition-all duration-700"
                  style={{
                    width:
                      totalMembers > 0
                        ? `${(activeMembers / totalMembers) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                  Paid
                </p>

                <span className="text-yellow-400">₹</span>
              </div>

              <p className="mt-3 text-3xl font-black">
                {paidMembers}
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                  style={{
                    width:
                      totalMembers > 0
                        ? `${(paidMembers / totalMembers) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                  Inactive
                </p>

                <span className="text-white/30">○</span>
              </div>

              <p className="mt-3 text-3xl font-black">
                {inactiveMembers}
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-white/20 transition-all duration-700"
                  style={{
                    width:
                      totalMembers > 0
                        ? `${(inactiveMembers / totalMembers) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ADMIN INFORMATION */}
        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl text-black">
              👤
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25">
                Account
              </p>

              <h2 className="mt-1 text-xl font-black">
                Admin Information
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/25">
                Name
              </p>

              <p className="mt-2 text-sm font-bold">
                {admin?.fullName || "Admin"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/25">
                Mobile
              </p>

              <p className="mt-2 text-sm font-bold">
                {admin?.mobileNumber || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-lime-400/10 bg-lime-400/[0.03] p-5">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/25">
                Account Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.6)]" />

                <p className="text-sm font-bold text-lime-300">
                  Authenticated
                </p>
              </div>
            </div>
          </div>
        </section>

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
              Admin Panel • 2026
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}