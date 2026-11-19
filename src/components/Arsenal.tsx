"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "./About";
import { useSound } from "./SoundProvider";
import { arsenal, type StackGroup, type Tool } from "@/lib/data";
import {
  NmapMark,
  ZapMark,
  NiktoMark,
  NessusMark,
  OpenvasMark,
  JavaMark,
} from "./ToolMarks";

const marks = {
  nmap: NmapMark,
  zap: ZapMark,
  nikto: NiktoMark,
  nessus: NessusMark,
  openvas: OpenvasMark,
  java: JavaMark,
} as const;

const filters: ("All" | StackGroup)[] = ["All", "Security", "Development"];

/** 3D tilt wrapper — pointer-tracked perspective. */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [t, setT] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ rx: -py * 14, ry: px * 14 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
      style={{ perspective: "700px" }}
      className="tilt-3d h-full"
    >
      <div
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 180ms ease-out",
        }}
        className="h-full"
      >
        {children}
      </div>
    </div>
  );
}

function ToolTile({ tool }: { tool: Tool }) {
  const { play } = useSound();
  return (
    <TiltCard>
      <div
        onMouseEnter={() => play("hover")}
        onClick={() => play("click")}
        className="card-sheen group flex h-full cursor-pointer flex-col items-center justify-center gap-3 rounded-card border border-line p-4 text-center transition-colors hover:border-accent/40 sm:p-5"
        style={{ transform: "translateZ(24px)" }}
      >
        <div
          className="flex h-11 w-11 items-center justify-center rounded-lg sm:h-12 sm:w-12"
          style={{
            background: tool.color ? `${tool.color}14` : "#1c1c1c",
            boxShadow: "0 8px 24px -12px rgba(0,0,0,0.8)",
          }}
        >
          {tool.mark ? (
            (() => {
              const Mark = marks[tool.mark];
              return <Mark size={26} color={tool.color} />;
            })()
          ) : tool.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tool.logo}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain [&_svg]:h-full [&_svg]:w-full"
            />
          ) : (
            <span
              className="font-serif text-xl italic"
              style={{ color: tool.color }}
            >
              {tool.name.charAt(0)}
            </span>
          )}
        </div>
        <span className="text-[0.82rem] leading-tight text-body/90 sm:text-sm">{tool.name}</span>
      </div>
    </TiltCard>
  );
}

export function Arsenal() {
  const { play } = useSound();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<"All" | StackGroup>("All");

  const shown = arsenal.filter((a) => filter === "All" || a.group === filter);

  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section id="arsenal" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionHeading index="02" title="Arsenal" eyebrow="Toolbox" />
      <motion.div {...rise}>
        <p className="-mt-4 mb-8 max-w-2xl text-muted">
          The tools I use to find weaknesses, analyze networks, and build
          solutions that hold up under pressure.
        </p>

        <div className="mb-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                play("toggle");
                setFilter(f);
              }}
              onMouseEnter={() => play("hover")}
              className={`rounded-full border px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition ${
                filter === f
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-line text-faint hover:border-line-strong hover:text-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((tool) => (
            <motion.div layout key={tool.name}>
              <ToolTile tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
