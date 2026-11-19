"use client";

/**
 * Synthesized UI sound engine (Web Audio API).
 * No audio files — every sound is generated on the fly.
 * Muted by default; toggle state persists in localStorage.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

const MASTER_GAIN = 0.5;

type Voice = "sine" | "triangle" | "square" | "sawtooth";

function tone(
  freq: number,
  {
    type = "sine",
    duration = 0.08,
    gain = 0.15,
    delay = 0,
    sweepTo,
  }: {
    type?: Voice;
    duration?: number;
    gain?: number;
    delay?: number;
    sweepTo?: number;
  } = {}
) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, t0 + duration);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain * MASTER_GAIN, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noise({
  duration = 0.05,
  gain = 0.08,
  delay = 0,
  freq = 1800,
}: {
  duration?: number;
  gain?: number;
  delay?: number;
  freq?: number;
} = {}) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const bufferSize = Math.max(1, Math.floor(c.sampleRate * duration));
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = 1.2;
  const g = c.createGain();
  g.gain.setValueAtTime(gain * MASTER_GAIN, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  src.start(t0);
  src.stop(t0 + duration + 0.02);
}

export type SoundName =
  | "nav"
  | "hover"
  | "click"
  | "toggle"
  | "whoosh"
  | "chime"
  | "confirm"
  | "boot";

export function playSound(name: SoundName) {
  switch (name) {
    case "nav": // soft click
      tone(660, { type: "triangle", duration: 0.07, gain: 0.14, sweepTo: 520 });
      break;
    case "hover": // faint tick
      noise({ duration: 0.025, gain: 0.05, freq: 3200 });
      break;
    case "click": // satisfying two-tone pop
      tone(420, { type: "triangle", duration: 0.05, gain: 0.16 });
      tone(760, { type: "triangle", duration: 0.06, gain: 0.12, delay: 0.035 });
      break;
    case "toggle": // clean blip
      tone(880, { type: "sine", duration: 0.06, gain: 0.15, sweepTo: 660 });
      break;
    case "whoosh": // noise sweep for palette
      noise({ duration: 0.16, gain: 0.07, freq: 900 });
      tone(300, { type: "sine", duration: 0.16, gain: 0.06, sweepTo: 700 });
      break;
    case "chime": // copy success
      tone(880, { type: "sine", duration: 0.1, gain: 0.13 });
      tone(1320, { type: "sine", duration: 0.16, gain: 0.11, delay: 0.09 });
      break;
    case "confirm": // form submit
      tone(523, { type: "sine", duration: 0.1, gain: 0.13 });
      tone(784, { type: "sine", duration: 0.14, gain: 0.12, delay: 0.1 });
      break;
    case "boot": // three-note pad
      tone(220, { type: "sine", duration: 0.3, gain: 0.09 });
      tone(262, { type: "sine", duration: 0.3, gain: 0.08, delay: 0.12 });
      tone(330, { type: "sine", duration: 0.42, gain: 0.07, delay: 0.24 });
      break;
  }
}
