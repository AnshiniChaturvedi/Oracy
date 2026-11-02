"use client";

import { ButtonLink } from "@/components/Button";
import { Badge, Card, CardHeader, EmptyState, PageHeader } from "@/components/dashboard/ui";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { useDashboard } from "@/features/dashboard/DashboardContext";
import { SampleSkillBars, StrengthsAndFocus, WeekBars } from "@/features/dashboard/parts";
import { SKILL_AREAS } from "@/lib/dashboard-data";
import { demoProgress, demoSkills } from "@/lib/demo-data";

const tips: Record<string, string[]> = {
  Communication: ["Pause for a breath instead of using filler words.", "Aim for answers of 60 to 90 seconds."],
  "Answer structure": ["Use STAR: situation, task, action, result.", "Finish with a one-sentence takeaway."],
  "Technical knowledge": ["Explain concepts to a beginner, then to an expert.", "Name trade-offs, not just definitions."],
  "Problem-solving": ["Restate the problem and confirm requirements first.", "Say edge cases aloud before you start coding."],
  "Confidence & delivery": ["Look at the camera when you begin and end an answer.", "Slow down slightly on your first sentence."],
};

export function PerformancePage() {
  const { data } = useDashboard();
  const sample = data.sampleMode;
  const focus = sample ? [...demoSkills].sort((a, b) => a.score - b.score).slice(0, 2).map((s) => s.label) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Performance Lab" description="See where you’re strong, where to focus, and how your practice is trending." actions={<ButtonLink href="/interview">Start Mock Interview</ButtonLink>} />

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7" labelledBy="pl-skills">
          <CardHeader id="pl-skills" title="Skill breakdown" subtitle={sample ? "These scores are not from completed interviews." : undefined} />
          {sample ? <SampleSkillBars showEvidence /> : <EmptyState icon="chart" title="No skill scores yet" text="Scores come from completed mock interviews. None have been recorded, so nothing is shown here." action={<ButtonLink href="/interview">Start your first interview</ButtonLink>} />}
        </Card>

        <div className="space-y-6 lg:col-span-5">
          <Card labelledBy="pl-sf">
            <CardHeader id="pl-sf" title="Strengths and focus areas" />
            {sample ? <StrengthsAndFocus /> : <p className="text-sm text-sub">Strengths and focus areas appear once you have interview results.</p>}
          </Card>
          <Card labelledBy="pl-act">
            <CardHeader id="pl-act" title="Practice activity" subtitle="Tasks you completed in your daily plan." />
            <WeekBars />
          </Card>
        </div>

        <Card className="lg:col-span-12" labelledBy="pl-trend">
          <CardHeader id="pl-trend" title="Readiness trend" subtitle={sample ? "Scores across six sessions. These are not from completed interviews." : undefined} />
          {sample ? <ProgressChart points={demoProgress} /> : <EmptyState icon="chart" title="Your trend starts with session one" text="After two or more completed interviews you’ll see how your readiness changes over time." action={<ButtonLink href="/interview" variant="outline">Take a mock interview</ButtonLink>} />}
        </Card>

        <Card className="lg:col-span-12" labelledBy="pl-tips">
          <CardHeader id="pl-tips" title="Improvement tips" subtitle="General guidance for each skill area. These are not generated from your answers." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_AREAS.map((area) => (
              <li key={area} className={`rounded-xl border p-4 ${focus.includes(area) ? "border-warn/40 bg-warn/5" : "border-line"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-medium text-ink">{area}</h3>
                  {focus.includes(area) && <Badge tone="warn">Focus area</Badge>}
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-sub">{tips[area].map((t) => <li key={t}>{t}</li>)}</ul>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
