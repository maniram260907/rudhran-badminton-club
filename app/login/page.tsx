import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
          
          <div className="text-6xl">🏸</div>

          <h1 className="mt-4 text-3xl font-bold">
            Rudhran Badminton Club
          </h1>

          <p className="mt-2 text-slate-400">
            Choose your login type
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {/* Member Login */}
            <Link
              href="/login/member"
              className="rounded-2xl border border-slate-700 bg-slate-950 p-6 text-left transition hover:border-cyan-400 hover:bg-cyan-400/10"
            >
              <div className="text-4xl">👤</div>

              <h2 className="mt-4 text-xl font-bold">
                Member Login
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Login to access your membership and payment details.
              </p>

              <div className="mt-5 font-semibold text-cyan-400">
                Continue as Member →
              </div>
            </Link>

            {/* Admin Login */}
            <Link
              href="/login/admin"
              className="rounded-2xl border border-slate-700 bg-slate-950 p-6 text-left transition hover:border-cyan-400 hover:bg-cyan-400/10"
            >
              <div className="text-4xl">🛡️</div>

              <h2 className="mt-4 text-xl font-bold">
                Admin Login
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Login to manage members, payments and the club.
              </p>

              <div className="mt-5 font-semibold text-cyan-400">
                Continue as Admin →
              </div>
            </Link>

          </div>

          <Link
            href="/"
            className="mt-8 inline-block text-sm text-slate-500 hover:text-cyan-400"
          >
            ← Back to Home
          </Link>

        </div>
      </div>
    </main>
  );
}