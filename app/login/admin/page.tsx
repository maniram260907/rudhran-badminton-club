"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!mobile || !password) {
      setMessage("Please enter mobile number and password.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify admin login
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: mobile,
          password: password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage(data.message || "Login failed.");
        return;
      }

      // Step 2: Create authentication session
      const authResponse = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: data.admin.id,
        }),
      });

      const authData = await authResponse.json();

      if (!authData.success) {
        setMessage("Login successful, but authentication failed.");
        return;
      }

      // Step 3: Authentication successful
      // Step 3: Authentication successful
      router.push("/admin");
    } catch (error) {
      console.error("Admin login error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function handleForgotPassword() {
    setMessage("Forgot password option selected.");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-6xl">🛡️</div>

          <h1 className="mt-4 text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-slate-400">
            Rudhran Badminton Club Management
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Mobile Number
              </label>

              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter admin mobile number"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Admin Login"}
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full text-sm text-cyan-400 hover:text-cyan-300"
            >
              Forgot Password?
            </button>

            {message && (
              <p className="rounded-xl bg-slate-800 p-3 text-center text-sm text-cyan-300">
                {message}
              </p>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Authorized administrators only.
        </p>
      </div>
    </main>
  );
}