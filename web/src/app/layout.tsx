import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ConsoleStrip } from "@/components/console-strip";
import { ChatWidget } from "@/components/chat-widget";
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
    default: "Danial Kordmodanlou — Agentic AI × ML × Real-time Systems",
    template: "%s · Danial Kordmodanlou",
  },
  description:
    "Software Engineer at EvenUp. Agentic AI, defended MSc in VR perception (York), LangGraph multi-agent systems. Guardian, DigiHuman, CaseLogic.",
  openGraph: {
    title: "Danial Kordmodanlou",
    description:
      "Software Engineer @ EvenUp · agentic AI · defended MSc (illusory parallax in VR) · Guardian, DigiHuman, LangGraph systems.",
    type: "website",
    siteName: "Danial Kordmodanlou",
    locale: "en_US",
    // Explicit preview images (most platforms use the first).
    images: [
      {
        url: "/images/figure_headphone.gif",
        alt: "DigiHuman — real-time markerless mocap",
      },
      {
        url: "/images/Dani.jpg",
        alt: "Danial Kordmodanlou",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danial Kordmodanlou",
    description:
      "Software Engineer @ EvenUp · agentic AI · defended MSc (illusory parallax in VR) · Guardian, DigiHuman, LangGraph systems.",
    images: ["/images/figure_headphone.gif", "/images/Dani.jpg"],
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
        <div className="relative isolate z-10">
          <main className="pt-12">{children}</main>
          <Footer />
          <ConsoleStrip />
        </div>
        <ChatWidget />
      </body>
    </html>
  );
}
