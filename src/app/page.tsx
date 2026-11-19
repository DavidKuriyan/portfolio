"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Arsenal } from "@/components/Arsenal";
import { CaseFiles } from "@/components/CaseFiles";
import { FieldWork } from "@/components/FieldWork";
import { Credentials } from "@/components/Credentials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";

export default function Home() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main className="relative z-[2]">
        <Hero />
        <About />
        <Arsenal />
        <CaseFiles />
        <FieldWork />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </>
  );
}
