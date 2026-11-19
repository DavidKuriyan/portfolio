"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, MapPin, ShieldCheck } from "lucide-react";
import { useSound } from "./SoundProvider";
import { profile } from "@/lib/data";
import { GlbStage } from "./GlbStage";

// Live-ops terminal lines — real SOC/VAPT console
const consoleLines = [
  { p: "david@vapt", c: "~ $", t: "whoami" },
  { p: "", c: "", t: "cybersecurity-engineer · vapt · osint" },
  { p: "david@vapt", c: "~ $", t: "cat focus.txt" },
  { p: "", c: "", t: "detect · analyze · harden · report" },
  { p: "david@vapt", c: "~ $", t: "./scan --target=recon" },
  { p: "", c: "✓", t: "3 modules loaded · 0 critical exposure found", ok: true },
];

export function Hero() {
  const { play } = useSound();
  const reduce = useReducedMotion();

  // The hero cube is desktop-only: on phones it costs a 493 KB download
  // plus a WebGL render loop that competes with scrolling.
  const [showCube, setShowCube] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setShowCube(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="hero-glow relative overflow-hidden pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-14 pt-12 sm:gap-12 sm:pb-24 sm:pt-24 lg:grid-cols-[1fr_auto]">
        {/* Left — identity */}
        <div>
          <motion.div {...fade(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted sm:text-[0.68rem]">
              “Security is a process, not a product.”
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.08)}
            className="max-w-3xl font-serif text-[2.6rem] leading-[1.06] tracking-tight text-body sm:text-7xl"
          >
            {profile.name.split(" ")[0]}{" "}
            <span className="italic text-accent">
              {profile.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>

          <motion.div {...fade(0.16)} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            {profile.roles.map((r) => (
              <span key={r} className="flex items-center gap-2 text-base text-muted sm:text-xl">
                <ShieldCheck size={16} className="text-accent" />
                {r}
              </span>
            ))}
          </motion.div>

          <motion.p
            {...fade(0.24)}
            className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-body/90 sm:text-3xl"
          >
            “{profile.tagline}”
          </motion.p>

          <motion.div {...fade(0.32)} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#case-files"
              onClick={() => play("click")}
              onMouseEnter={() => play("hover")}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-dim"
            >
              View case files
              <ArrowDown size={16} className="transition group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              onClick={() => play("click")}
              onMouseEnter={() => play("hover")}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-medium text-body transition hover:border-accent hover:text-accent"
            >
              Hire me
            </a>
            <span className="flex items-center gap-1.5 text-sm text-faint">
              <MapPin size={14} />
              {profile.location}
            </span>
          </motion.div>
        </div>

        {/* Right — 3D cube, desktop only */}
        {showCube && (
          <motion.div {...fade(0.3)} className="w-full max-w-md justify-self-center">
            <GlbStage url="/glb/cube.glb" className="aspect-square w-full" />
          </motion.div>
        )}
      </div>

      {/* Cyber ops console band — fills the space before About */}
      <motion.div {...fade(0.4)} className="border-y border-line bg-panel/60">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 py-6 sm:grid-cols-2 sm:gap-6 sm:py-8 lg:grid-cols-[1.3fr_1fr]">
          {/* dark console panel for contrast */}
          <div className="console-panel overflow-x-auto rounded-card border border-line p-4 font-mono text-[0.68rem] leading-relaxed sm:text-[0.72rem]">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-alert" />
              <span className="h-2.5 w-2.5 rounded-full bg-warn" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="ml-2 uppercase tracking-[0.16em] text-slate-400">
                david@vapt — ops console
              </span>
            </div>
            {consoleLines.map((l, i) => (
              <div key={i} className="flex gap-2 break-words">
                {l.p && (
                  <span>
                    <span className="text-accent">{l.p}</span>
                    <span className="text-slate-400"> {l.c}</span>
                  </span>
                )}
                <span className={l.ok ? "text-accent" : "text-slate-200"}>{l.t}</span>
              </div>
            ))}
          </div>

          {/* live status grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: "Focus", v: "VAPT & AppSec", c: "text-accent" },
              { k: "Toolkit", v: "13 tools", c: "text-body" },
              { k: "Building", v: "NIDS · Argus", c: "text-body" },
              { k: "Status", v: "Hardening", c: "text-info" },
            ].map((s) => (
              <div
                key={s.k}
                onMouseEnter={() => play("hover")}
                className="card-sheen rounded-card border border-line p-3.5 transition-colors hover:border-accent/50 sm:p-4"
              >
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                  {s.k}
                </div>
                <div className={`mt-1.5 font-serif text-lg ${s.c}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
