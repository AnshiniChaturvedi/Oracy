import { Container, Eyebrow } from "@/components/Container";
import { Reveal, SplitText } from "@/components/Reveal";

const steps = [
  { n: "01", title: "Upload Resume", body: "Add your PDF or DOCX and choose the role you are aiming for. You review the extracted profile before anything else happens." },
  { n: "02", title: "Practice Interview", body: "Answer personalised questions out loud on camera. Follow-ups adapt to what you actually said." },
  { n: "03", title: "AI Analysis", body: "Your answer text, voice and on-camera presence are analysed separately, then combined into component scores." },
  { n: "04", title: "Personalized Feedback", body: "See your readiness score, the evidence behind it, and a short list of what to practise next." },
];

export function Workflow() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-28 md:py-40">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal><Eyebrow>How it works</Eyebrow></Reveal>
              <SplitText text="Four steps from resume to readiness." accent="readiness." className="mt-6 font-display text-display" />
              <p className="mt-6 max-w-md text-lg text-ink/65">The same loop, every session, so progress is visible over time.</p>
            </div>
          </div>

          <ol className="space-y-5 lg:col-span-7">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 60}>
                <div className="group flex gap-6 rounded-3xl border border-line bg-card p-8 transition duration-500 hover:border-cobalt/60 md:gap-10 md:p-10">
                  <span className="outline-text font-display text-7xl leading-none transition duration-500 group-hover:text-cobalt md:text-8xl" aria-hidden="true">{s.n}</span>
                  <div>
                    <h3 className="font-display text-title">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-md leading-relaxed text-ink/65">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
