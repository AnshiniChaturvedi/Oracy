import { StartLink } from "@/components/StartLink";
import { ArrowRight, Plus } from "@/components/Icons";
import { Container, Eyebrow } from "@/components/Container";
import { Parallax } from "@/components/Parallax";
import { Portrait } from "@/components/Portrait";
import { Reveal, SplitText } from "@/components/Reveal";
import { siteConfig } from "@/lib/site";

const faqs = [
  { q: "Is ORACY live today?", a: "No. ORACY is a student project in active development. This site is a front-end prototype: the sign-in is a local demo, and the scores, charts and analysis shown are illustrative samples." },
  { q: "What will ORACY analyse?", a: "The plan covers your resume, the content of your answers, your speech (pace, pauses, filler words) and your on-camera presence (posture, gaze, movement, framing)." },
  { q: "How accurate are the posture and gaze measures?", a: "They are estimates and can be affected by lighting, camera angle and individual differences. They are meant as practice hints, never as judgments of personality or employability." },
  { q: "How is the readiness score calculated?", a: "The design makes it explainable and configurable, with the evidence for each component visible. Scoring weights have not been validated yet, so any number you see today is a demo value." },
  { q: "What happens to my resume and recordings?", a: "Nothing is uploaded in this prototype. The planned design stores files securely, asks for consent before recording, and lets you delete your data." },
  { q: "Do I need an account?", a: "Not to look around. You can open the interview setup and dashboard preview from this site, and the demo sign-in accepts any valid email without creating a real account." },
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
          <SplitText text="Your next interview starts *here.*" className="max-w-4xl font-display text-hero" />
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-lg text-ink/70">Set up a practice interview, or create a demo account to preview your dashboard.</p>
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
              <SplitText text="Straight *answers.*" className="mt-6 font-display text-display" />
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
