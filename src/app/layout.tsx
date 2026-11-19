import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Poppins, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/SoundProvider";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://davidkuriyan.dev"),
  title: "David Kuriyan E — Cybersecurity Engineer",
  description:
    "Cybersecurity undergraduate specializing in VAPT, network analysis, OSINT, and security analysis. I build secure systems — and break weak ones.",
  keywords: [
    "David Kuriyan",
    "Cybersecurity Engineer",
    "VAPT",
    "Penetration Testing",
    "OSINT",
    "Network Security",
    "Ethical Hacking",
  ],
  authors: [{ name: "David Kuriyan E" }],
  openGraph: {
    type: "website",
    title: "David Kuriyan E — Cybersecurity Engineer",
    description:
      "Cybersecurity undergraduate specializing in VAPT, network analysis, OSINT, and security analysis.",
    images: ["/logo.webp"],
  },
  twitter: {
    card: "summary",
    title: "David Kuriyan E — Cybersecurity Engineer",
    description:
      "Cybersecurity undergraduate specializing in VAPT, network analysis, OSINT, and security analysis.",
    images: ["/logo.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f9fc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${poppins.variable} ${geistMono.variable} ${caveat.variable}`}
    >
      <body className="grain">
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
