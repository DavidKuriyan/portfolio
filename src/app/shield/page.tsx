"use client";

import { GuardianShield3D } from "@/components/GuardianShield3D";

export default function ShieldPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0a0f1e] text-white">
      {/* ambient navy + cyan glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(26,188,216,0.18), transparent 70%), radial-gradient(40% 40% at 50% 80%, rgba(16,24,45,0.9), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-8 px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-cyan-300/80">
            Guardian Shield · Real-time 3D
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">
            Cybersecurity <span className="italic text-cyan-300">Guardian</span>
          </h1>
        </div>

        {/* Live animated shield — transparent background */}
        <GuardianShield3D className="h-[46vh] min-h-[280px] w-full max-w-xl sm:h-[60vh]" />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/shield.glb"
            download
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-medium text-[#0a0f1e] transition hover:bg-cyan-300"
          >
            Download .glb model
          </a>
          <span className="font-mono text-[0.7rem] text-slate-400">
            PBR glass · brushed silver · animated core, circuits &amp; orbit particles
          </span>
        </div>
      </div>
    </main>
  );
}
