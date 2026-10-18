export const siteConfig = {
  name: "ORACY",
  tagline: "Beyond Answers. Towards Excellence.",
  /**
   * Photography slot. Imagery is currently an original SVG illustration.
   * To use licensed photos: add files under `public/images/` and set
   * `enabled: true`.
   */
  photography: {
    enabled: false as boolean,
    hero: "/images/hero.jpg",
    preview: "/images/preview.jpg",
    cta: "/images/cta.jpg",
  },
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1",
} as const;

export const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
] as const;

export const MAX_RESUME_MB = 5;
