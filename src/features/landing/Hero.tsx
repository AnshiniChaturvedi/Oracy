import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { ArrowRight } from "@/components/Icons";
import { Reveal, SplitText } from "@/components/Reveal";
import { StartLink } from "@/components/StartLink";
import { HeroDashboard } from "@/features/landing/HeroDashboard";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_75%_30%,rgba(40,95,232,0.13),transparent_70%)]" aria-hidden="true" />
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden="true" />
      <Container className="grid flex-1 items-center gap-14 pb-20 pt-32 lg:grid-cols-12 lg:gap-8 lg:pt-36">
        <div className="lg:col-span-7">
          <SplitText as="h1" text="Beyond Answers. Towards Excellence." accent="Excellence." className="font-display text-[clamp(3rem,7.4vw,7.5rem)] leading-[0.9] tracking-[-0.03em]" />

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

    </section>
  );
}
