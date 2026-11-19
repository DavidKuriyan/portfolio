"use client";

import { SecurityLock3D } from "@/components/SecurityLock3D";

export default function LockPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#080d1a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 45%, rgba(26,188,216,0.18), transparent 70%), radial-gradient(50% 50% at 50% 85%, rgba(16,24,45,0.95), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-8 px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-cyan-300/80">
            Encrypted Core · Real-time 3D
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">
            The <span className="italic text-cyan-300">Lock</span>
          </h1>
          <p className="mt-3 text-slate-400">What's protected stays protected.</p>
        </div>

        <SecurityLock3D className="h-[46vh] min-h-[280px] w-full max-w-xl sm:h-[58vh]" />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/lock.glb"
            download
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-medium text-[#080d1a] transition hover:bg-cyan-300"
          >
            Download .glb model
          </a>
          <span className="font-mono text-[0.7rem] text-slate-400">
            Crystal glass · chrome mechanism · animated core, shackle &amp; energy ring
          </span>
        </div>
      </div>
    </main>
  );
}
