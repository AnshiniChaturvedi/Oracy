import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { ArrowRight } from "@/components/Icons";
import { Reveal, SplitText } from "@/components/Reveal";
import { StartLink } from "@/components/StartLink";
import { HeroDashboard } from "@/features/landing/HeroDashboard";

const ticker = ["Resume intelligence", "Personalized questions", "Adaptive follow-ups", "Answer evaluation", "Speech analysis", "Vision estimates", "Readiness score"];

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_75%_30%,rgba(40,95,232,0.13),transparent_70%)]" aria-hidden="true" />
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden="true" />
      <span aria-hidden="true" className="outline-text pointer-events-none absolute inset-x-0 bottom-6 -z-10 select-none text-center font-display text-[27vw] leading-[0.8] opacity-70">
        ORACY
      </span>

      <Container className="grid flex-1 items-center gap-14 pb-20 pt-32 lg:grid-cols-12 lg:gap-8 lg:pt-36">
        <div className="lg:col-span-7">
          <Reveal variant="fade">
            <p className="mb-8 inline-flex w-fit items-center gap-3 rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/80">
              <span className="h-2 w-2 rounded-full bg-cobalt" aria-hidden="true" />
              Prototype · analysis shown is illustrative
            </p>
          </Reveal>

          <SplitText as="h1" text="Beyond Answers. Towards *Excellence.*" className="font-display text-[clamp(3rem,7.4vw,7.5rem)] leading-[0.9] tracking-[-0.03em]" />

          <Reveal delay={250}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70 md:text-xl">
              Upload your resume, practise with questions built around you, and get clear feedback on your answers, your voice and your presence.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <StartLink className="px-8 py-4 text-base">
                Start Your Interview <ArrowRight />
              </StartLink>
              <ButtonLink href="/#how-it-works" variant="outline" className="px-8 py-4 text-base">
                See how it works
              </ButtonLink>
            </div>
            <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-6">
              {[["Words", "Answer analysis"], ["Voice", "Speech fluency"], ["Presence", "Posture and gaze"]].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-display text-3xl text-cobalt">{k}</dt>
                  <dd className="mt-1 text-sm text-ink/60">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5 lg:pl-6" variant="scale" delay={200}>
          <HeroDashboard />
        </Reveal>
      </Container>

      <div className="relative border-y border-line bg-card/70 py-4 backdrop-blur" aria-hidden="true">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-ink/60">
          {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-12">
              {t}
              <span className="text-cobalt">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
