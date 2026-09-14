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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-5xl">🏸</div>

          <p className="mt-4 text-slate-400">
            Loading Admin Dashboard...
          </p>
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              🏸 Rudhran Badminton Club
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Admin Dashboard
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              {admin?.fullName || "Admin"}
            </p>

            <p className="text-sm text-slate-400">
              Administrator
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Welcome, {admin?.fullName || "Admin"}! 👋
          </h2>

          <p className="mt-2 text-slate-400">
            Manage your badminton club from here.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-4xl">👥</div>

            <h3 className="mt-5 text-lg font-semibold">
              Total Members
            </h3>

            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {totalMembers}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-4xl">💰</div>

            <h3 className="mt-5 text-lg font-semibold">
              Paid Fees
            </h3>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {paidMembers}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-4xl">⏳</div>

            <h3 className="mt-5 text-lg font-semibold">
              Pending Fees
            </h3>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingMembers}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-4xl">🏸</div>

            <h3 className="mt-5 text-lg font-semibold">
              Active Members
            </h3>

            <p className="mt-2 text-3xl font-bold text-blue-400">
              {activeMembers}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <button
            onClick={() => {
              window.location.href = "/admin/members";
            }}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-left transition hover:border-cyan-400"
          >
            <div className="text-4xl">👥</div>

            <h3 className="mt-4 text-xl font-bold">
              Manage Members
            </h3>

            <p className="mt-2 text-slate-400">
              View and manage all registered club members.
            </p>
          </button>

          <button
            onClick={() => {
              window.location.href = "/admin/payment";
            }}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-left transition hover:border-cyan-400"
          >
            <div className="text-4xl">💳</div>

            <h3 className="mt-4 text-xl font-bold">
              Payment Management
            </h3>

            <p className="mt-2 text-slate-400">
              Track paid and pending membership fees.
            </p>
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h3 className="text-xl font-bold">
            Admin Information
          </h3>

          <div className="mt-5 space-y-3 text-slate-300">
            <p>
              <span className="font-semibold text-white">
                Name:
              </span>{" "}
              {admin?.fullName || "Admin"}
            </p>

            <p>
              <span className="font-semibold text-white">
                Mobile:
              </span>{" "}
              {admin?.mobileNumber || "Not available"}
            </p>

            <p>
              <span className="font-semibold text-white">
                Status:
              </span>{" "}
              <span className="text-green-400">
                Authenticated
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}