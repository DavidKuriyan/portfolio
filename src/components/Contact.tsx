"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Copy,
  Check,
  MapPin,
  Send,
} from "lucide-react";
import { SectionHeading } from "./About";
import { useSound } from "./SoundProvider";
import { profile } from "@/lib/data";

export function Contact() {
  const { play } = useSound();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      play("chime");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const links = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Github,
      label: "GitHub",
      value: `@${profile.githubHandle}`,
      href: profile.github,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: `in/${profile.linkedinHandle}`,
      href: profile.linkedin,
    },
  ];

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionHeading index="06" title="Transmit" eyebrow="Contact" />
      <motion.div {...rise}>
        <p className="-mt-4 mb-10 max-w-2xl font-serif text-2xl italic leading-snug text-body/90">
          Have a security problem, an internship opening, or an idea worth
          building? My inbox is open.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact channels */}
          <div className="space-y-3">
            <div
              onClick={copyEmail}
              onMouseEnter={() => play("hover")}
              className="card-sheen group flex cursor-pointer items-center justify-between rounded-card border border-line p-4 transition-colors hover:border-accent/40"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <Mail size={16} />
                </span>
                <div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                    Email
                  </div>
                  <div className="break-all text-sm text-body">{profile.email}</div>
                </div>
              </div>
              {copied ? (
                <Check size={16} className="text-accent" />
              ) : (
                <Copy size={16} className="text-faint transition group-hover:text-muted" />
              )}
            </div>

            {links.slice(1).map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                onClick={() => play("click")}
                onMouseEnter={() => play("hover")}
                className="card-sheen group flex items-center gap-3 rounded-card border border-line p-4 transition-colors hover:border-line-strong"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-elevated text-muted transition group-hover:text-accent">
                  <l.icon size={16} />
                </span>
                <div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                    {l.label}
                  </div>
                  <div className="text-sm text-body">{l.value}</div>
                </div>
              </a>
            ))}

            <div className="flex items-center gap-2 pl-1 text-sm text-faint">
              <MapPin size={14} />
              {profile.location}
            </div>
          </div>

          {/* Message form (mailto fallback) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              play("confirm");
              const data = new FormData(e.currentTarget);
              const subject = encodeURIComponent(
                `Portfolio inquiry from ${data.get("name")}`
              );
              const body = encodeURIComponent(String(data.get("message")));
              window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
            }}
            className="card-sheen space-y-4 rounded-card border border-line p-4 sm:p-5"
          >
            <div className="section-label">Send a message</div>
            <input
              required
              name="name"
              autoComplete="name"
              placeholder="Your name"
              className="w-full rounded-md border border-line bg-elevated px-4 py-2.5 text-sm text-body placeholder:text-faint focus:border-accent/50 focus:outline-none"
            />
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Your email"
              className="w-full rounded-md border border-line bg-elevated px-4 py-2.5 text-sm text-body placeholder:text-faint focus:border-accent/50 focus:outline-none"
            />
            <textarea
              required
              name="message"
              rows={4}
              placeholder="What do you have in mind?"
              className="w-full resize-none rounded-md border border-line bg-elevated px-4 py-2.5 text-sm text-body placeholder:text-faint focus:border-accent/50 focus:outline-none"
            />
            <button
              type="submit"
              onMouseEnter={() => play("hover")}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-bg transition hover:bg-accent-dim"
            >
              Send message
              <Send size={15} className="transition group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
