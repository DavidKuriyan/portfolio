"use client";

import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { useSound } from "./SoundProvider";
import { profile } from "@/lib/data";

export function Footer() {
  const { play } = useSound();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10">
        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => play("click")}
            onMouseEnter={() => play("hover")}
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted transition hover:border-accent/40 hover:text-accent sm:h-9 sm:w-9"
          >
            <Github size={16} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={() => play("click")}
            onMouseEnter={() => play("hover")}
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted transition hover:border-accent/40 hover:text-accent sm:h-9 sm:w-9"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            onClick={() => play("click")}
            onMouseEnter={() => play("hover")}
            aria-label="Email"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted transition hover:border-accent/40 hover:text-accent sm:h-9 sm:w-9"
          >
            <Mail size={16} />
          </a>
        </div>

        <p className="text-center text-sm text-faint">
          Designed & built with intention — secure by default.
        </p>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">
          © {new Date().getFullYear()} {profile.name}
        </p>

        <button
          onClick={() => {
            play("nav");
            const behavior: ScrollBehavior = window.matchMedia("(min-width: 768px)").matches
              ? "smooth"
              : "auto";
            window.scrollTo({ top: 0, behavior });
          }}
          onMouseEnter={() => play("hover")}
          className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-faint transition hover:border-line-strong hover:text-muted"
        >
          <ArrowUp size={12} />
          Back to top
        </button>
      </div>
    </footer>
  );
}
