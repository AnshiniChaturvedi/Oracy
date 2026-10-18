import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const display = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "ORACY — Beyond Answers. Towards Excellence.", template: "%s · ORACY" },
  description:
    "ORACY helps you prepare for interviews with personalised questions and feedback on your answers, voice and presence.",
};

export const viewport: Viewport = {
  themeColor: "#F7F9FC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-cobalt focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
