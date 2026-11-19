"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useSound } from "./SoundProvider";
import { ModelStage } from "./ModelStage";
import { BUILDERS } from "@/lib/models3d/catalog";

export type ShowcaseModel = {
  slug: string;
  key: string;
  title: string;
  subtitle: string;
  tagline: string;
  body: string;
  features: string[];
  glb: string;
  spec: string;
};

export function ModelShowcaseSection({
  model,
  prev,
  next,
}: {
  model: ShowcaseModel;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}) {
  const { play } = useSound();
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Stable build fn per model — constructs the three.js group once on the client.
  const build = useMemo(() => {
    const fn = (BUILDERS as Record<string, () => import("three").Group>)[model.key];
    return fn;
  }, [model.key]);

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="hero-glow absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <motion.div {...fade(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted sm:text-[0.66rem]">
            3D Showcase · {model.subtitle}
          </span>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          {/* LEFT — live 3D model */}
          <motion.div
            {...fade(0.12)}
            className="card-sheen relative order-1 rounded-card border border-line p-2"
          >
            <div className="relative overflow-hidden rounded-[10px] bg-[radial-gradient(60%_55%_at_50%_40%,rgba(6,182,212,0.10),transparent_70%)]">
              <ModelStage build={build} className="h-[320px] w-full cursor-grab active:cursor-grabbing sm:h-[400px] lg:h-[440px]" />
            </div>
            <div className="absolute bottom-3 right-4 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-faint sm:text-[0.6rem]">
              drag to rotate · <span className="hidden sm:inline">scroll to zoom</span>
              <span className="sm:hidden">pinch to zoom</span>
            </div>
          </motion.div>

          {/* RIGHT — content */}
          <div className="order-2">
            <motion.h1
              {...fade(0.2)}
              className="font-serif text-3xl leading-[1.05] tracking-tight text-body sm:text-5xl"
            >
              <span className="italic text-accent">{model.title}</span>
            </motion.h1>

            <motion.p {...fade(0.28)} className="mt-5 max-w-xl font-serif text-lg italic leading-snug text-body/90 sm:text-2xl">
              “{model.tagline}”
            </motion.p>

            <motion.p {...fade(0.34)} className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted">
              {model.body}
            </motion.p>

            <motion.ul {...fade(0.4)} className="mt-6 flex flex-wrap gap-2">
              {model.features.map((f) => (
                <li
                  key={f}
                  onMouseEnter={() => play("hover")}
                  className="card-sheen rounded-full border border-line px-3 py-1.5 font-mono text-[0.7rem] text-muted transition hover:border-accent/40 hover:text-accent"
                >
                  {f}
                </li>
              ))}
            </motion.ul>

            <motion.p {...fade(0.44)} className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-faint">
              {model.spec}
            </motion.p>

            <motion.div {...fade(0.5)} className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`/glb/${model.glb}`}
                download
                onClick={() => play("click")}
                onMouseEnter={() => play("hover")}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-dim sm:w-auto"
              >
                Download .glb
                <Download size={16} className="transition group-hover:translate-y-0.5" />
              </a>
              <Link
                href="/"
                onClick={() => play("click")}
                onMouseEnter={() => play("hover")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3 font-medium text-body transition hover:border-accent hover:text-accent sm:w-auto"
              >
                <ArrowLeft size={16} />
                Back to portfolio
              </Link>
            </motion.div>

            {/* prev / next between the three showcase pages */}
            <motion.div {...fade(0.56)} className="mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-5">
              {prev ? (
                <Link
                  href={`/showcase/${prev.slug}`}
                  onClick={() => play("nav")}
                  onMouseEnter={() => play("hover")}
                  className="group inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-faint transition hover:text-accent sm:text-[0.7rem]"
                >
                  <ArrowLeft size={13} className="transition group-hover:-translate-x-0.5" />
                  {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/showcase/${next.slug}`}
                  onClick={() => play("nav")}
                  onMouseEnter={() => play("hover")}
                  className="group inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-faint transition hover:text-accent sm:text-[0.7rem]"
                >
                  {next.title}
                  <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <span />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
