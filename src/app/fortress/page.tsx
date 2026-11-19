"use client";

import { ZeroTrustFortress3D } from "@/components/ZeroTrustFortress3D";

const layers = [
  { name: "Identity", note: "Who are you?" },
  { name: "Authentication", note: "Prove it." },
  { name: "Access Control", note: "Least privilege." },
];

export default function FortressPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#080d1a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 42%, rgba(26,188,216,0.16), transparent 70%), radial-gradient(50% 50% at 50% 85%, rgba(16,24,45,0.95), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-8 px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-cyan-300/80">
            Zero Trust Architecture · Real-time 3D
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">
            The <span className="italic text-cyan-300">Fortress</span>
          </h1>
          <p className="mt-3 text-slate-400">Never trust, always verify — layer by layer.</p>
        </div>

        <ZeroTrustFortress3D className="h-[46vh] min-h-[280px] w-full max-w-xl sm:h-[58vh]" />

        <div className="grid w-full max-w-2xl grid-cols-3 gap-3">
          {layers.map((l, i) => (
            <div
              key={l.name}
              className="rounded-xl border border-cyan-400/20 bg-white/5 p-4 text-center backdrop-blur"
            >
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cyan-300/70">
                Layer {i + 1}
              </div>
              <div className="mt-1 font-serif text-lg">{l.name}</div>
              <div className="mt-0.5 font-mono text-[0.68rem] text-slate-400">{l.note}</div>
            </div>
          ))}
        </div>

        <a
          href="/fortress.glb"
          download
          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-medium text-[#080d1a] transition hover:bg-cyan-300"
        >
          Download .glb model
        </a>
      </div>
    </main>
  );
}
