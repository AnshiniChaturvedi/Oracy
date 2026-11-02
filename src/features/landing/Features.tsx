import { Container, Eyebrow } from "@/components/Container";
import { Reveal, SplitText } from "@/components/Reveal";

const features = [
  { n: "01", title: "Resume intelligence", body: "Upload a PDF or DOCX. ORACY maps your skills, projects and experience into a structured profile you can review and correct.", span: "lg:col-span-7", tone: "light" },
  { n: "02", title: "Personalized questions", body: "Questions are shaped by your profile and the role you are targeting, not pulled from a generic list.", span: "lg:col-span-5", tone: "dark" },
  { n: "03", title: "Adaptive follow-ups", body: "Vague answer? The next question probes the gap, the way a real interviewer would.", span: "lg:col-span-4", tone: "dark" },
  { n: "04", title: "NLP answer evaluation", body: "Each answer is assessed for relevance, structure, grammar and completeness, with the reasoning shown.", span: "lg:col-span-4", tone: "dark" },
  { n: "05", title: "Speech analysis", body: "Speaking rate, pauses, filler words, hesitation and fluency, measured from your recorded voice.", span: "lg:col-span-4", tone: "dark" },
  { n: "06", title: "Computer vision", body: "Posture, gaze direction, movement and camera framing, reported as estimates and never as judgments of who you are.", span: "lg:col-span-5", tone: "dark" },
  { n: "07", title: "Readiness scoring", body: "An explainable Interview Readiness Score with a clear breakdown, configurable weights and the evidence behind every number.", span: "lg:col-span-7", tone: "light" },
] as const;

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-28 md:py-40">
      <Container>
        <Reveal><Eyebrow>Capabilities</Eyebrow></Reveal>
        <SplitText text="Seven signals. One honest picture of readiness." accent="readiness." className="mt-6 max-w-5xl font-display text-display" />
        <p className="mt-6 max-w-2xl text-lg text-ink/65">
          The platform is designed around seven connected capabilities. This page previews the intended experience; the analysis engines are still in development.
        </p>

        <ul className="mt-16 grid gap-5 lg:grid-cols-12">
          {features.map((f, i) => {
            const light = f.tone === "light";
            return (
              <Reveal as="li" key={f.n} delay={(i % 3) * 90} className={`${f.span}`}>
                <article
                  className={`group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border p-8 transition duration-500 hover:-translate-y-1 md:p-10 ${
                    light ? "border-cobalt/20 bg-cobalt-tint text-ink shadow-card hover:border-cobalt/60" : "border-line bg-card hover:border-cobalt/60 hover:shadow-lift"
                  }`}
                >
                  <span className={`font-mono text-xs tracking-[0.22em] ${"text-cobalt"}`}>{f.n}</span>
                  <div>
                    <h3 className="font-display text-title">{f.title}</h3>
                    <p className={`mt-4 max-w-md leading-relaxed ${"text-ink/65"}`}>{f.body}</p>
                  </div>
                  <span aria-hidden="true" className={`pointer-events-none absolute -right-6 -top-10 select-none font-display text-[10rem] leading-none transition duration-500 group-hover:-translate-y-2 ${light ? "text-cobalt/[0.10]" : "text-ink/[0.04]"}`}>
                    {f.n}
                  </span>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
