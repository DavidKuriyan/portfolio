"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Crosshair, Brain } from "lucide-react";
import { useSound } from "./SoundProvider";
import { about, currently, profile, capabilities, traits } from "@/lib/data";

function SectionHeading({
  index,
  title,
  eyebrow,
}: {
  index: string;
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="section-label">
        {index} / {eyebrow ?? title}
      </div>
      <h2 className="mt-2 font-serif text-4xl tracking-tight text-body sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

export { SectionHeading };

export function About() {
  const { play } = useSound();
  const reduce = useReducedMotion();

  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionHeading index="01" title="About me" eyebrow="Dossier" />

      <div className="grid gap-10 md:grid-cols-[280px_1fr] md:gap-14">
        {/* Profile card */}
        <motion.aside {...rise} className="md:sticky md:top-24 md:self-start">
          <div className="card-sheen rounded-card border border-line p-5">
            <div className="relative mx-auto mb-4 w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt={`${profile.name} logo`}
                width={128}
                height={128}
                className="h-32 w-32 rounded-full ring-2 ring-line-strong"
              />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-bg ring-2 ring-line">
                <span className="h-2.5 w-2.5 animate-pulse-dot rounded-full bg-accent" />
              </span>
            </div>
            <p className="text-center font-serif text-xl text-body">{profile.name}</p>
            <p className="mt-1 text-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
              {profile.headline}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {about.focus.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Currently card — monxdev-style live card */}
          <div className="mt-4 rounded-card border border-line bg-panel p-4">
            <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">
              <Sparkles size={13} className="text-accent" />
              {currently.label}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-body/90">{currently.line}</p>
          </div>
        </motion.aside>

        {/* Body */}
        <motion.div {...rise} className="space-y-5">
          <p className="font-serif text-2xl leading-snug text-body sm:text-3xl">
            {about.lead}
          </p>
          {about.body.map((p, i) => (
            <p key={i} className="leading-relaxed text-muted">
              {p}
            </p>
          ))}

          <div className="mt-6 rounded-card border border-line bg-panel p-5">
            <div className="section-label mb-4 flex items-center gap-2">
              <Crosshair size={13} className="text-accent" />
              Core capabilities
            </div>
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {capabilities.map((c) => (
                <li key={c.term} className="group">
                  <div className="flex items-center gap-2 text-body/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="font-medium">{c.term}</span>
                  </div>
                  <p className="ml-3.5 font-mono text-[0.66rem] uppercase tracking-wide text-faint">
                    {c.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-line bg-panel p-5">
            <div className="section-label mb-4 flex items-center gap-2">
              <Brain size={13} className="text-accent" />
              Operator traits
            </div>
            <div className="flex flex-wrap gap-2">
              {traits.map((t) => (
                <span
                  key={t.term}
                  title={t.note}
                  onMouseEnter={() => play("hover")}
                  className="cursor-default rounded-full border border-line bg-elevated px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-wide text-muted transition hover:border-accent/40 hover:text-accent"
                >
                  {t.term}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
