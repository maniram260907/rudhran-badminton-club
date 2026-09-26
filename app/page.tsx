"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  id: number;
  fullName: string;
  batch: string;
};

const batches = [
  {
    id: "morning-5-6:30",
    title: "Morning",
    time: "5:00 AM – 6:30 AM",
  },
  {
    id: "morning-6:45-8:30",
    title: "Morning",
    time: "6:45 AM – 8:30 AM",
  },
  {
    id: "morning-9-10",
    title: "Morning",
    time: "9:00 AM – 10:00 AM",
  },
  {
    id: "night-5-6",
    title: "Night",
    time: "5:00 PM – 6:00 PM",
  },
  {
    id: "night-6-7",
    title: "Night",
    time: "6:00 PM – 7:00 PM",
  },
];

const features = [
  {
    number: "01",
    title: "Structured Training",
    description:
      "Train with organized batches designed around convenient morning and evening schedules.",
  },
  {
    number: "02",
    title: "Professional Environment",
    description:
      "A focused badminton environment where players can practice, improve and stay consistent.",
  },
  {
    number: "03",
    title: "Active Community",
    description:
      "Connect with fellow badminton players and become part of a growing club community.",
  },
];

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [openBatch, setOpenBatch] = useState<string | null>(null);
  const [loadingBatch, setLoadingBatch] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await fetch("/api/public/batches", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.members)) {
          setMembers(data.members);
        }
      } catch (error) {
        console.error("Failed to load public members:", error);
      }
    }

    loadMembers();
  }, []);

  async function toggleBatch(batchId: string) {
    if (openBatch === batchId) {
      setOpenBatch(null);
      return;
    }

    setLoadingBatch(true);

    try {
      const response = await fetch("/api/public/batches", {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && Array.isArray(data.members)) {
          setMembers(data.members);
        }
      }
    } catch (error) {
      console.error("Failed to load batch members:", error);
    } finally {
      setLoadingBatch(false);
      setOpenBatch(batchId);
    }
  }

  function getBatchMembers(batchId: string) {
    return members.filter(
      (member) =>
        member.batch.trim().toLowerCase() === batchId.trim().toLowerCase()
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F6F3] text-[#1F2933]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#DDE3DC] bg-[#F5F6F3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3F7D58] text-xl text-white shadow-sm">
              🏸
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-[#1F2933]">
                RUDHRAN
              </p>
              <p className="text-[11px] font-medium tracking-[0.18em] text-[#64748B]">
                BADMINTON CLUB
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#about"
              className="text-sm font-medium text-[#475569] transition hover:text-[#3F7D58]"
            >
              About
            </a>

            <a
              href="#batches"
              className="text-sm font-medium text-[#475569] transition hover:text-[#3F7D58]"
            >
              Batches
            </a>

            <a
              href="/login/member"
              className="text-sm font-semibold text-[#475569] transition hover:text-[#3F7D58]"
            >
              Member Login
            </a>

            <a
              href="/login/admin"
              className="text-sm font-semibold text-[#475569] transition hover:text-[#3F7D58]"
            >
              Admin
            </a>

            <a
              href="/login/member/register"
              className="rounded-full bg-[#3F7D58] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#346849]"
            >
              Join Club
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <a
              href="/login/member"
              className="rounded-full border border-[#CBD5CF] px-4 py-2 text-xs font-semibold text-[#475569]"
            >
              Login
            </a>

            <a
              href="/login/member/register"
              className="rounded-full bg-[#3F7D58] px-4 py-2 text-xs font-semibold text-white"
            >
              Join
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* HERO TEXT */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#CBD5CF] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#3F7D58] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#3F7D58]" />
              BADMINTON • TRAIN • IMPROVE • CONNECT
            </div>

            <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[#1F2933] sm:text-6xl lg:text-7xl">
              Play with
              <span className="block text-[#3F7D58]">purpose.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#64748B] sm:text-lg">
              Welcome to Rudhran Badminton Club — a focused community for
              players who want to train consistently, improve their game and
              enjoy badminton together.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/login/member/register"
                className="inline-flex items-center justify-center rounded-full bg-[#3F7D58] px-7 py-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-[#346849]"
              >
                Become a Member
                <span className="ml-2">→</span>
              </a>

              <a
                href="#batches"
                className="inline-flex items-center justify-center rounded-full border border-[#CBD5CF] bg-white px-7 py-3.5 text-sm font-bold text-[#475569] transition duration-300 hover:-translate-y-1 hover:border-[#3F7D58] hover:text-[#3F7D58]"
              >
                View Batches
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#64748B]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1F2933]">5+</span>
                Training Batches
              </div>

              <div className="h-5 w-px bg-[#CBD5CF]" />

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1F2933]">Active</span>
                Player Community
              </div>

              <div className="h-5 w-px bg-[#CBD5CF]" />

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1F2933]">Daily</span>
                Practice
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative">
            {/* Floating shuttlecock */}
            <div className="pointer-events-none absolute -right-3 top-8 z-10 animate-[float_4s_ease-in-out_infinite] text-4xl sm:-right-5 sm:top-12 sm:text-5xl">
              🏸
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[#DDE3DC] bg-white p-3 shadow-[0_20px_60px_rgba(31,41,51,0.10)]">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <img
                  src="/badminton-hero.png"
                  alt="Badminton players on court"
                  className="h-[420px] w-full object-cover transition duration-700 hover:scale-[1.02] sm:h-[500px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2933]/30 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-7 left-7 rounded-2xl border border-white/50 bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                  Rudhran Badminton Club
                </p>

                <p className="mt-1 text-lg font-bold text-[#1F2933]">
                  Train. Improve. Repeat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="border-y border-[#DDE3DC] bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F7D58]">
                About the Club
              </p>

              <h2 className="mt-4 max-w-md text-4xl font-bold tracking-[-0.03em] text-[#1F2933] sm:text-5xl">
                More than just a court.
              </h2>
            </div>

            <div>
              <p className="max-w-3xl text-lg leading-8 text-[#64748B]">
                Rudhran Badminton Club is built around regular practice,
                discipline and a welcoming badminton community. Whether you are
                starting your journey or looking to sharpen your game, our
                structured batches make it easier to stay consistent.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature.number}
                    className="group rounded-2xl border border-[#DDE3DC] bg-[#F5F6F3] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#3F7D58]/40 hover:shadow-md"
                  >
                    <span className="text-xs font-bold tracking-[0.15em] text-[#3F7D58]">
                      {feature.number}
                    </span>

                    <h3 className="mt-5 text-lg font-bold text-[#1F2933]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#64748B]">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURT SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-[#DDE3DC] bg-white p-3 shadow-sm">
            <img
              src="/Badminton.jpg"
              alt="Badminton court"
              className="h-[350px] w-full rounded-[1.5rem] object-cover transition duration-700 hover:scale-[1.02] sm:h-[430px]"
            />
          </div>

          <div className="lg:pl-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F7D58]">
              Built for Consistency
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1F2933] sm:text-5xl">
              Find a schedule that fits your game.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#64748B]">
              Choose a training batch that works with your daily routine.
              Regular sessions help build rhythm, confidence and better
              badminton habits.
            </p>

            <a
              href="#batches"
              className="mt-8 inline-flex items-center gap-2 font-bold text-[#3F7D58] transition hover:gap-3"
            >
              Explore training batches
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* BATCHES */}
      <section
        id="batches"
        className="border-y border-[#DDE3DC] bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F7D58]">
                Training Schedule
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1F2933] sm:text-5xl">
                Choose your batch.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-[#64748B]">
              Tap a batch to view the active members currently training in
              that session.
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            {batches.map((batch, index) => {
              const isOpen = openBatch === batch.id;
              const batchMembers = getBatchMembers(batch.id);

              return (
                <div
                  key={batch.id}
                  className="overflow-hidden rounded-2xl border border-[#DDE3DC] bg-[#F5F6F3] transition duration-300 hover:border-[#3F7D58]/40"
                >
                  <button
                    type="button"
                    onClick={() => toggleBatch(batch.id)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#3F7D58] shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#64748B]">
                          {batch.title}
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#1F2933]">
                          {batch.time}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#CBD5CF] bg-white text-[#475569] transition duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ↓
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="border-t border-[#DDE3DC] px-5 py-5 sm:px-7">
                        {loadingBatch ? (
                          <p className="text-sm text-[#64748B]">
                            Loading players...
                          </p>
                        ) : batchMembers.length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {batchMembers.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-3 rounded-xl border border-[#DDE3DC] bg-white px-4 py-3"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3F7D58]/10 text-sm font-bold text-[#3F7D58]">
                                  {member.fullName.charAt(0).toUpperCase()}
                                </div>

                                <span className="text-sm font-semibold text-[#1F2933]">
                                  {member.fullName}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-[#CBD5CF] bg-white px-5 py-6 text-center">
                            <p className="text-sm font-semibold text-[#475569]">
                              No active members in this batch yet.
                            </p>

                            <p className="mt-1 text-xs text-[#94A3B8]">
                              Be the first to join this session.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#1F2933] px-7 py-14 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#3F7D58]/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CC5AA]">
              Ready to start?
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
              Make badminton part of your routine.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#CBD5E1]">
              Join Rudhran Badminton Club and find a training schedule that
              fits your day.
            </p>

            <a
              href="/login/member/register"
              className="mt-8 inline-flex rounded-full bg-[#3F7D58] px-7 py-3.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#4C8D67]"
            >
              Join Rudhran Badminton Club
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#DDE3DC] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3F7D58] text-lg text-white">
                  🏸
                </div>

                <div>
                  <p className="text-sm font-bold tracking-wide text-[#1F2933]">
                    RUDHRAN
                  </p>

                  <p className="text-[10px] font-medium tracking-[0.18em] text-[#64748B]">
                    BADMINTON CLUB
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-[#94A3B8]">
                Train with purpose. Play with passion.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-[#64748B]">
              <a
                href="/login/member"
                className="transition hover:text-[#3F7D58]"
              >
                Member Login
              </a>

              <a
                href="/login/admin"
                className="transition hover:text-[#3F7D58]"
              >
                Admin
              </a>

              <a
                href="/login/member/register"
                className="transition hover:text-[#3F7D58]"
              >
                Join Club
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-[#E2E8E4] pt-6 text-xs text-[#94A3B8]">
            © {new Date().getFullYear()} Rudhran Badminton Club. All rights
            reserved.
          </div>
        </div>
      </footer>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(-6deg);
          }

          50% {
            transform: translateY(-12px) rotate(6deg);
          }
        }
      `}</style>
    </main>
  );
}