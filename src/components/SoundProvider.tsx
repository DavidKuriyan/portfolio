"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { playSound, type SoundName } from "@/lib/sound";

/**
 * Ambient UI sound — clicks and hovers only (no scroll sound).
 * Always on. Respects prefers-reduced-motion as a sensory-sensitivity proxy.
 */

type SoundContextValue = {
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue>({ play: () => {} });

export function SoundProvider({ children }: { children: ReactNode }) {
  const play = useCallback((name: SoundName) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    playSound(name);
  }, []);

  return (
    <SoundContext.Provider value={{ play }}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
