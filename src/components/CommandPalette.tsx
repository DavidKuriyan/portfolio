"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, ArrowUpRight } from "lucide-react";
import { useSound } from "./SoundProvider";

type Action = {
  id: string;
  label: string;
  section?: string;
  kind: "navigate" | "link";
  href?: string;
};

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const { play } = useSound();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const actions = useMemo<Action[]>(
    () => [
      { id: "about", label: "Go to About", section: "about", kind: "navigate" },
      { id: "arsenal", label: "Go to Arsenal", section: "arsenal", kind: "navigate" },
      { id: "case-files", label: "Go to Case Files", section: "case-files", kind: "navigate" },
      { id: "field-work", label: "Go to Field Work", section: "field-work", kind: "navigate" },
      { id: "credentials", label: "Go to Credentials", section: "credentials", kind: "navigate" },
      { id: "contact", label: "Go to Contact", section: "contact", kind: "navigate" },
      { id: "github", label: "Open GitHub", kind: "link", href: "https://github.com/DavidKuriyan" },
      { id: "linkedin", label: "Open LinkedIn", kind: "link", href: "https://www.linkedin.com/in/david-kuriyan" },
    ],
    []
  );

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
        play("whoosh");
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, play]);

  const run = (action: Action) => {
    play("click");
    setOpen(false);
    if (action.kind === "navigate" && action.section) {
      document.getElementById(action.section)?.scrollIntoView({ behavior: "smooth" });
    } else if (action.kind === "link" && action.href) {
      window.open(action.href, "_blank", "noreferrer");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[18vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line-strong bg-panel shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={16} className="text-faint" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => (a + 1) % Math.max(1, filtered.length));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) =>
                      (a - 1 + filtered.length) % Math.max(1, filtered.length)
                    );
                  }
                  if (e.key === "Enter" && filtered[active]) {
                    run(filtered[active]);
                  }
                }}
                placeholder="Type a command or search…"
                className="w-full bg-transparent py-4 text-sm text-body placeholder:text-faint focus:outline-none"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.62rem] text-faint">
                ESC
              </kbd>
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-faint">
                  No results.
                </div>
              ) : (
                filtered.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => run(a)}
                    onMouseEnter={() => {
                      setActive(i);
                      play("hover");
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                      i === active
                        ? "bg-elevated text-body"
                        : "text-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <ArrowUpRight size={14} className="text-faint" />
                      {a.label}
                    </span>
                    {i === active && (
                      <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.6rem] text-faint">
                        ↵
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
