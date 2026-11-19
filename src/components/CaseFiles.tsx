"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FileText } from "lucide-react";
import { SectionHeading } from "./About";
import { useSound } from "./SoundProvider";
import { projects, type Project } from "@/lib/data";

const images: Record<string, string> = {
  nids: "/case-files/nids.png",
  argus: "/case-files/argus.png",
  talenthub: "/case-files/talenthub.png",
};

/** Pointer-tracked 3D tilt. */
function Tilt({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [t, setT] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ rx: -py * 8, ry: px * 8 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
      style={{ perspective: "900px" }}
      className={`${className ?? ""} tilt-3d`}
    >
      <div
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 200ms ease-out",
        }}
        className="h-full"
      >
        {children}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { play } = useSound();
  const reduce = useReducedMotion();
  const src = images[project.id];

  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.article {...rise}>
      <Tilt className="h-full">
        <div
          onMouseEnter={() => play("hover")}
          className="card-sheen group relative flex h-full flex-col overflow-hidden rounded-card border border-line transition-colors hover:border-accent/40"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Illustration header */}
          <div className="relative h-40 overflow-hidden border-b border-line sm:h-44">
            {src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`${project.title} — project screenshot`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full bg-bg/80 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted backdrop-blur">
              <FileText size={10} style={{ color: project.accent }} />
              Case file · {String(index + 1).padStart(2, "0")}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-serif text-2xl tracking-tight text-body">
              {project.title}
            </h3>
            <p
              className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.12em]"
              style={{ color: project.accent }}
            >
              {project.tagline}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-faint"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <div className="section-label mb-2">Highlights</div>
              <ul className="space-y-1.5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-body/85">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: project.accent }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}

export function CaseFiles() {
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
    <section id="case-files" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionHeading index="03" title="Case files" eyebrow="Projects" />
      <motion.div {...rise}>
        <p className="-mt-4 mb-10 max-w-2xl text-muted">
          Selected work that shows both sides of what I do — building secure
          systems, and understanding how they're attacked.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
