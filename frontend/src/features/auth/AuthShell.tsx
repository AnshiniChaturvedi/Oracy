import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Parallax } from "@/components/Parallax";
import { Portrait } from "@/components/Portrait";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-line lg:block" aria-hidden="true">
        <Parallax speed={0.06}>
          <Portrait landmarks />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/10 to-paper/20" />
        <div className="absolute bottom-0 p-12">
          <p className="max-w-md font-display text-5xl leading-[1.02]">
            Beyond Answers. Towards <span className="italic text-cobalt">Excellence.</span>
          </p>
        </div>
      </aside>

      <section className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm text-mute transition hover:text-cobalt">← Back to site</Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-md py-12">
          <h1 className="font-display text-5xl leading-none sm:text-6xl">{title}</h1>
          <p className="mt-4 text-ink/65">{subtitle}</p>

          <p role="note" className="mt-6 rounded-xl border border-cobalt/30 bg-cobalt/5 px-4 py-3 text-sm text-ink/80">
            <strong className="font-medium text-cobalt">Demo mode.</strong> There is no authentication backend yet. Nothing is sent to a server and no real account is created.
          </p>

          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-mute">{footer}</div>
        </div>
      </section>
    </div>
  );
}
