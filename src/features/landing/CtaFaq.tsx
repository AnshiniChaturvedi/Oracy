import { StartLink } from "@/components/StartLink";
import { ArrowRight, Plus } from "@/components/Icons";
import { Container, Eyebrow } from "@/components/Container";
import { Parallax } from "@/components/Parallax";
import { Portrait } from "@/components/Portrait";
import { Reveal, SplitText } from "@/components/Reveal";
import { siteConfig } from "@/lib/site";

const faqs = [
  { q: "Is ORACY live today?", a: "ORACY is in active development. Sign-in is stored locally, and the scores, charts and analysis shown are not results from completed interviews." },
  { q: "What will ORACY analyse?", a: "The plan covers your resume, the content of your answers, your speech (pace, pauses, filler words) and your on-camera presence (posture, gaze, movement, framing)." },
  { q: "How accurate are the posture and gaze measures?", a: "They are estimates and can be affected by lighting, camera angle and individual differences. They are meant as practice hints, never as judgments of personality or employability." },
  { q: "How is the readiness score calculated?", a: "The score is designed to show the evidence behind each component. The scoring weights have not been validated, and the figures shown are not generated from completed interviews." },
  { q: "What happens to my resume and recordings?", a: "Nothing is uploaded or recorded. Your files stay on your device, and you can remove any locally saved profile data in Settings." },
  { q: "Do I need an account?", a: "You can explore the site without signing in. Signing in stores a local session in this browser; no online account is created." },
];

export function CtaFaq() {
  return (
    <>
      <section className="relative isolate overflow-hidden py-32 md:py-48">
        <div className="absolute inset-0 -z-10">
          <Parallax speed={0.08}>
            <div className="h-full w-full opacity-60 md:translate-x-[30%]">
              <Portrait photo={siteConfig.photography.cta} alt="" />
            </div>
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-paper/10" />
        </div>
        <Container>
          <SplitText text="Your next interview starts here." accent="here." className="max-w-4xl font-display text-hero" />
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-lg text-ink/70">Set up a practice interview or create an account to explore your dashboard.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <StartLink className="px-8 py-4 text-base" signedInHref="/dashboard">
                Get Started <ArrowRight />
              </StartLink>
              <StartLink variant="outline" className="px-8 py-4 text-base">
                Start Your Interview
              </StartLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-20 py-28 md:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal><Eyebrow>FAQ</Eyebrow></Reveal>
              <SplitText text="Straight answers." accent="answers." className="mt-6 font-display text-display" />
            </div>
            <div className="lg:col-span-8">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 40}>
                  <details className="group border-b border-line py-6">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 font-display text-2xl transition hover:text-cobalt md:text-3xl">
                      {f.q}
                      <Plus />
                    </summary>
                    <p className="mt-4 max-w-2xl leading-relaxed text-ink/65">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
