"use client";

import { motion, useReducedMotion } from "motion/react";
import { Award, GraduationCap } from "lucide-react";
import { SectionHeading } from "./About";
import { useSound } from "./SoundProvider";
import { credentials, education } from "@/lib/data";

export function Credentials() {
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
    <section id="credentials" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionHeading index="05" title="Credentials" eyebrow="Verified" />

      <motion.div {...rise}>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {credentials.map((c, i) => (
            <div
              key={i}
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="card-sheen group cursor-pointer rounded-card border border-line p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Award size={18} />
              </div>
              <h3 className="mt-4 font-serif text-xl tracking-tight text-body">
                {c.title}
              </h3>
              <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
                {c.issuer}
              </p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mt-16">
          <div className="section-label mb-6 flex items-center gap-2">
            <GraduationCap size={14} />
            Education
          </div>
          <div className="space-y-4">
            {education.map((e, i) => (
              <div
                key={i}
                className="card-sheen rounded-card border border-line p-5 transition-colors hover:border-line-strong"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl tracking-tight text-body">
                      {e.degree}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{e.institution}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-faint">
                      {e.period}
                    </span>
                    <p className="mt-1 text-sm text-accent">{e.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
