"use client";

import { motion, useReducedMotion } from "motion/react";
import { Building2, MapPin } from "lucide-react";
import { SectionHeading } from "./About";
import { useSound } from "./SoundProvider";
import { experience } from "@/lib/data";

export function FieldWork() {
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
    <section id="field-work" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionHeading index="04" title="Field work" eyebrow="Experience" />
      <motion.div {...rise}>
        <p className="-mt-4 mb-10 max-w-2xl text-muted">
          Where I've applied security tooling and pentesting methodology on real
          projects.
        </p>
      </motion.div>

      <div className="relative space-y-6 border-l border-line pl-6 md:pl-8">
        {experience.map((job, i) => (
          <motion.div
            key={i}
            {...rise}
            onMouseEnter={() => play("hover")}
            className="card-sheen relative rounded-card border border-line p-5 transition-colors hover:border-line-strong sm:p-6"
          >
            {/* timeline node */}
            <span className="absolute -left-[31px] top-6 flex h-3 w-3 items-center justify-center rounded-full bg-bg ring-2 ring-accent md:-left-[39px]" />

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-2xl tracking-tight text-body">
                  {job.role}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-accent" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1.5 text-faint">
                    <MapPin size={13} />
                    {job.location}
                  </span>
                </div>
              </div>
              <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent">
                {job.period}
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {job.points.map((p, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-body/85">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
