"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Icon } from "@/components/dashboard/Icon";
import { Badge, Card, EmptyState, PageHeader, SelectField } from "@/components/dashboard/ui";
import { useDashboard } from "@/features/dashboard/DashboardContext";
import { NoSessions, ScorePill, sessionDate } from "@/features/dashboard/parts";
import { demoSessions } from "@/lib/demo-data";

const kindOptions = ["All types", "Technical", "Behavioural", "Mixed"].map((v) => ({ value: v, label: v }));
const scoreOptions = [
  { value: "all", label: "Any score" },
  { value: "80", label: "80 and above" },
  { value: "70", label: "70 to 79" },
  { value: "0", label: "Below 70" },
];
const sortOptions = [
  { value: "new", label: "Newest first" },
  { value: "old", label: "Oldest first" },
  { value: "high", label: "Highest score" },
];

export function HistoryPage() {
  const { data } = useDashboard();
  const sample = data.sampleMode;
  const [kind, setKind] = useState("All types");
  const [score, setScore] = useState("all");
  const [sort, setSort] = useState("new");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id && demoSessions.some((s) => s.id === id)) setOpen(id);
  }, []);

  const rows = useMemo(() => {
    const filtered = demoSessions.filter((s) => {
      if (kind !== "All types" && s.kind !== kind) return false;
      if (score === "80") return s.score >= 80;
      if (score === "70") return s.score >= 70 && s.score < 80;
      if (score === "0") return s.score < 70;
      return true;
    });
    return filtered.sort((a, b) => (sort === "old" ? b.daysAgo - a.daysAgo : sort === "high" ? b.score - a.score : a.daysAgo - b.daysAgo));
  }, [kind, score, sort]);

  const filtersActive = kind !== "All types" || score !== "all";

  return (
    <div className="space-y-6">
      <PageHeader title="Interview History" description="Review past sessions, scores and feedback." actions={<ButtonLink href="/interview">Start Mock Interview</ButtonLink>} />

      {!sample ? (
        <Card><NoSessions /></Card>
      ) : (
        <Card>
          <div className="grid gap-4 sm:grid-cols-3">
            <SelectField label="Interview type" value={kind} options={kindOptions} onChange={(e) => setKind(e.target.value)} />
            <SelectField label="Score" value={score} options={scoreOptions} onChange={(e) => setScore(e.target.value)} />
            <SelectField label="Sort by" value={sort} options={sortOptions} onChange={(e) => setSort(e.target.value)} />
          </div>
          <p className="mt-4 text-sm text-sub" role="status">Showing {rows.length} of {demoSessions.length} sessions. These are not from completed interviews.</p>

          {rows.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon="history" title="No sessions match these filters" text="Try a different type or score range." action={filtersActive ? <Button variant="outline" onClick={() => { setKind("All types"); setScore("all"); }}>Clear filters</Button> : undefined} />
            </div>
          ) : (
            <ul className="mt-2 divide-y divide-line">
              {rows.map((s) => {
                const expanded = open === s.id;
                return (
                  <li key={s.id} id={s.id} className="scroll-mt-24 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink">{sessionDate(s)} <Badge tone="info">{s.kind}</Badge></p>
                        <p className="mt-1 text-sm text-sub">{s.role} · {s.durationMin} min · Focus: {s.focus}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <ScorePill score={s.score} />
                        <Button variant="outline" className="px-4 py-2" aria-expanded={expanded} aria-controls={`fb-${s.id}`} onClick={() => setOpen(expanded ? null : s.id)}>
                          {expanded ? "Hide feedback" : "View feedback"}
                          <Icon name="chevronDown" className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                        </Button>
                      </div>
                    </div>
                    {expanded && (
                      <div id={`fb-${s.id}`} className="mt-4 rounded-xl bg-surface p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-cobalt-deep">Feedback preview</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">{s.feedback.map((f) => <li key={f}>{f}</li>)}</ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
