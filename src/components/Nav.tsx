"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSound } from "./SoundProvider";
import { profile } from "@/lib/data";

const links = [
  { id: "about", label: "About" },
  { id: "arsenal", label: "Arsenal" },
  { id: "case-files", label: "Case Files" },
  { id: "field-work", label: "Field Work" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { play } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string) => {
    play("nav");
    setOpen(false);
    // Long smooth scrolls through a 10k-px page stutter on phones.
    const behavior: ScrollBehavior = window.matchMedia("(min-width: 768px)").matches
      ? "smooth"
      : "auto";
    document.getElementById(id)?.scrollIntoView({ behavior });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-white md:bg-white/95 md:backdrop-blur-xl"
          : "bg-[#f7f9fc]/95 md:bg-white/70 md:backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button
          onClick={() => {
            play("nav");
            const behavior: ScrollBehavior = window.matchMedia("(min-width: 768px)").matches
              ? "smooth"
              : "auto";
            window.scrollTo({ top: 0, behavior });
          }}
          className="group flex items-center gap-2.5"
          aria-label="Back to top"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full ring-1 ring-line-strong transition group-hover:ring-accent"
          />
          <span className="font-serif text-lg text-body">
            {profile.firstName}
            <span className="text-accent">.</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              onMouseEnter={() => play("hover")}
              className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-elevated hover:text-body"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-panel md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-3">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                className="rounded-md px-2 py-3 text-left text-sm text-muted transition hover:bg-elevated hover:text-body"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
