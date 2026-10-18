import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Future Minimal palette
        paper: "#F7F9FC",            // page background
        ink: { DEFAULT: "#151C2C", soft: "#3B465C" }, // deep slate text
        line: "#E5EBF4",             // borders and subtle surfaces
        card: "#FFFFFF",             // cards
        cobalt: { DEFAULT: "#285FE8", deep: "#1D49B8", tint: "#EAF0FD" }, // electric cobalt
        mute: { DEFAULT: "#5F6B82", 2: "#8A94A8" },
        // Dashboard additions
        surface: "#EEF3FF",          // light blue surfaces
        sub: "#64748B",              // secondary text
        ok: "#10B981",               // success
        warn: "#F59E0B",             // warning
        bad: "#DC2626",              // error
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["clamp(3.1rem, 9.2vw, 9.5rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        display: ["clamp(2.4rem, 6vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.025em" }],
        title: ["clamp(1.6rem, 2.6vw, 2.4rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(21,28,44,0.04), 0 12px 32px -12px rgba(21,28,44,0.10)",
        lift: "0 24px 60px -24px rgba(40,95,232,0.28)",
      },
      maxWidth: { page: "1400px" },
    },
  },
  plugins: [],
};

export default config;
