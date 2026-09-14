export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">RUDHRAN</h1>
          <p className="text-xs tracking-[0.3em] text-slate-400">
            BADMINTON CLUB
          </p>
        </div>

        <div className="hidden gap-8 md:flex">
          <a href="#" className="hover:text-cyan-400">
            Home
          </a>
          <a href="#about" className="hover:text-cyan-400">
            About
          </a>
          <a href="#batches" className="hover:text-cyan-400">
            Batches
          </a>
          <a href="#contact" className="hover:text-cyan-400">
            Contact
          </a>
        </div>

        <a
  href="/login"
  className="rounded-full bg-cyan-400 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
>
  Login
</a>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[75vh] items-center px-6 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Train • Play • Compete
            </p>

            <h2 className="text-5xl font-black leading-tight md:text-7xl">
              Elevate Your
              <span className="block text-cyan-400">Game.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Welcome to Rudhran Badminton Club — a place to train,
              improve your skills, stay fit and compete at your best.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-cyan-400 px-7 py-3 font-bold text-slate-950 hover:bg-cyan-300">
                Join the Club
              </button>

              <button className="rounded-full border border-slate-700 px-7 py-3 font-semibold hover:border-cyan-400 hover:text-cyan-400">
                View Batches
              </button>
            </div>
          </div>

          {/* Badminton Card */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
              <div className="flex h-80 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/5">
                <div className="text-center">
                  <div className="text-8xl">🏸</div>
                  <p className="mt-4 text-xl font-bold">RUDHRAN</p>
                  <p className="text-sm tracking-[0.3em] text-slate-400">
                    BADMINTON CLUB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="border-t border-slate-800 px-6 py-20 md:px-12"
      >
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Why Rudhran?
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            More Than Just Badminton
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-900 p-8">
              <div className="text-4xl">🏸</div>
              <h3 className="mt-4 text-xl font-bold">
                Professional Training
              </h3>
              <p className="mt-3 text-slate-400">
                Improve your technique, movement and game strategy.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 p-8">
              <div className="text-4xl">💪</div>
              <h3 className="mt-4 text-xl font-bold">Fitness</h3>
              <p className="mt-3 text-slate-400">
                Build speed, stamina, strength and agility.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 p-8">
              <div className="text-4xl">🏆</div>
              <h3 className="mt-4 text-xl font-bold">Competition</h3>
              <p className="mt-3 text-slate-400">
                Prepare yourself to perform confidently in tournaments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Batches Section */}
      <section id="batches" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Training
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Choose Your Batch
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold">Morning Batch</h3>
              <p className="mt-2 text-slate-400">6:00 AM – 8:00 AM</p>

              <button className="mt-6 w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950">
                Select
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold">Evening Batch</h3>
              <p className="mt-2 text-slate-400">4:00 PM – 6:00 PM</p>

              <button className="mt-6 w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950">
                Select
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold">Advanced Batch</h3>
              <p className="mt-2 text-slate-400">6:00 PM – 8:00 PM</p>

              <button className="mt-6 w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950">
                Select
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t border-slate-800 px-6 py-10 text-center"
      >
        <h2 className="text-xl font-bold">RUDHRAN BADMINTON CLUB</h2>

        <p className="mt-2 text-slate-500">
          Train hard. Play smart. Become better.
        </p>

        <p className="mt-6 text-sm text-slate-600">
          © 2026 Rudhran Badminton Club
        </p>
      </footer>
    </main>
  );
}