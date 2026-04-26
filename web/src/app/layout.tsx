import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ConsoleStrip } from "@/components/console-strip";
import { MatrixRain } from "@/components/effects/MatrixRain";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-c",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danial-kord.github.io"),
  title: {
    default: "Danial Kordmodanlou — ML × Real-time Systems × Game Engineering",
    template: "%s · Danial Kordmodanlou",
  },
  description:
    "Hybrid ML + game engineer. Real-time avatars, procedural worlds, VR training, and LLM systems.",
  openGraph: {
    title: "Danial Kordmodanlou",
    description:
      "ML × real-time systems × game engineering. DigiHuman, DreamForge, VR firefighter trainer, LLM CV builder.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-bg text-fg">
        {/* scroll-reactive matrix rain — fixed bg, behind all content */}
        <MatrixRain />

        <Nav />
        <div className="relative z-10">
          <main className="pt-12">{children}</main>
          <Footer />
          <ConsoleStrip />
        </div>
      </body>
    </html>
  );
}
