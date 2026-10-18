"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { ArrowRight } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { useIsClient, useSession } from "@/hooks/useSession";
import { demoComponents, demoHistory, demoOverallScore, demoProgress } from "@/lib/demo-data";
import { signOut } from "@/services/auth";

export function DashboardView() {
  const ready = useIsClient();
  const session = useSession();
  const router = useRouter();

  if (!ready) {
    return <div className="min-h-[70svh] pt-40" aria-busy="true" />;
  }

  if (!session) {
    return (
      <Container className="pb-32 pt-44">
        <div className="max-w-2xl">
          <h1 className="font-display text-display">Sign in to see your dashboard.</h1>
          <p className="mt-6 text-lg text-ink/65">The dashboard is a preview for signed-in users. The sign-in is a local demo, so any valid email works.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/login">Sign In</ButtonLink>
            <ButtonLink href="/signup" variant="outline">Create Account</ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  const firstName = session.name.split(" ")[0];

  return (
    <Container className="pb-28 pt-32 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt">Dashboard preview · demo data</p>
          <h1 className="mt-4 font-display text-display">Hello, {firstName}.</h1>
          <p className="mt-3 max-w-xl text-ink/65">Everything below is illustrative sample data. No interviews have been recorded or analysed.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/interview">Start Interview <ArrowRight /></ButtonLink>
          <Button variant="outline" onClick={async () => { await signOut(); router.push("/"); }}>Sign out</Button>
        </div>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="flex h-full flex-col items-center rounded-3xl border border-line bg-card p-8 text-ink shadow-card">
            <ScoreRing value={demoOverallScore} label="Readiness" size={220} />
            <p className="mt-5 text-center text-sm text-ink/65">Latest readiness score (sample)</p>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={80}>
          <div className="h-full rounded-3xl border border-line bg-card p-8">
            <h2 className="font-display text-title">Progress across sessions</h2>
            <div className="mt-6"><ProgressChart points={demoProgress} /></div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5">
          <div className="h-full rounded-3xl border border-line bg-card p-8">
            <h2 className="font-display text-title">Score breakdown</h2>
            <ul className="mt-6 space-y-5">
              {demoComponents.map((c) => (
                <li key={c.key}>
                  <div className="flex justify-between text-sm"><span>{c.label}</span><span className="font-mono">{c.score}</span></div>
                  <div className="meter mt-2 h-1.5 overflow-hidden rounded-full bg-line" style={{ "--w": `${c.score}%` } as CSSProperties}>
                    <i className="rounded-full bg-cobalt" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={80}>
          <div className="h-full rounded-3xl border border-line bg-card p-8">
            <h2 className="font-display text-title">Interview history</h2>
            <ul className="mt-6 divide-y divide-line">
              {demoHistory.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium">{h.label} <span className="text-mute">· {h.role}</span></p>
                    <p className="text-sm text-mute">Focus: {h.focus}</p>
                  </div>
                  <span className="rounded-full border border-cobalt/40 px-3 py-1 font-mono text-sm text-cobalt">{h.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <p className="mt-10 text-sm text-mute">
        Signed in as {session.email} (demo session). <Link href="/#faq" className="text-cobalt underline-offset-4 hover:underline">Read the FAQ</Link>
      </p>
    </Container>
  );
}
