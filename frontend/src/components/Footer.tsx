import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { siteConfig } from "@/lib/site";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Interview preview", href: "/#preview" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Readiness score", href: "/#score" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/signup" },
      { label: "Forgot password", href: "/forgot-password" },
      { label: "Dashboard preview", href: "/dashboard" },
      { label: "Start an interview", href: "/interview" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-card pb-10 pt-20">
      <Container>
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <Logo />
            <p className="mt-8 max-w-md font-display text-4xl leading-[1.05] sm:text-5xl">
              Beyond Answers. Towards <span className="italic text-cobalt">Excellence.</span>
            </p>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title} className="md:col-span-3 lg:col-span-3">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">{c.title}</h2>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ink/80 transition hover:text-cobalt">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 text-sm text-mute md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Student project prototype.</p>
          <p className="max-w-xl md:text-right">
            Prototype interface. Sign-in is a local demo and all scores, charts, and analysis shown are illustrative samples, not real results.
            Posture, gaze, and presentation metrics are estimates, not measures of personality or employability.
          </p>
        </div>
      </Container>
    </footer>
  );
}
