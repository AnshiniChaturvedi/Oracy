"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Container, Eyebrow } from "@/components/Container";
import { ArrowRight } from "@/components/Icons";
import { TextField } from "@/components/forms/Field";
import { MAX_RESUME_MB, siteConfig } from "@/lib/site";
import { validateResumeFile } from "@/lib/validation";

const roles = ["Backend Engineer", "Frontend Engineer", "Data Analyst", "Machine Learning Engineer", "Product Manager"];

export function InterviewSetup() {
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ role?: string; file?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = { role: role.trim() ? undefined : "Enter a target role.", file: validateResumeFile(file, MAX_RESUME_MB) };
    setErrors(next);
    setSubmitted(false);
    if (next.role || next.file) return;
    setSubmitted(true);
  }

  return (
    <Container className="pb-28 pt-32 md:pt-40">
      <Eyebrow>Interview setup</Eyebrow>
      <h1 className="mt-6 max-w-3xl font-display text-display">Set up your practice <span className="italic text-cobalt">interview.</span></h1>
      <p className="mt-6 max-w-2xl text-lg text-ink/65">Choose a role and add your resume. Your file stays in this browser.</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <form onSubmit={onSubmit} noValidate className="space-y-6 lg:col-span-7">
          <div>
            <TextField label="Target role" list="roles" value={role} onChange={(e) => setRole(e.target.value)} error={errors.role} placeholder="e.g. Backend Engineer" />
            <datalist id="roles">{roles.map((r) => <option key={r} value={r} />)}</datalist>
          </div>

          <div>
            <label htmlFor="resume" className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-mute">Resume (PDF or DOCX, up to {MAX_RESUME_MB} MB)</label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              aria-invalid={errors.file ? true : undefined}
              className="block w-full rounded-xl border border-dashed border-cobalt/30 bg-card p-5 text-sm text-ink/75 file:mr-4 file:rounded-full file:border-0 file:bg-cobalt file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
            />
            {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
          </div>

          <Button type="submit">Continue <ArrowRight /></Button>

          {submitted && (
            <div role="status" className="rounded-2xl border border-line bg-card p-6">
              <h2 className="font-display text-3xl">Checks passed. Nothing was uploaded.</h2>
              <p className="mt-3 text-ink/70">
                Your file and role stayed in your browser. The resume upload, question generation and analysis services are not built yet, so this is where the interview room would begin.
              </p>
            </div>
          )}
        </form>

        <aside className="rounded-3xl border border-line bg-card p-8 lg:col-span-5">
          <h2 className="font-display text-title">Backend integration</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            Proposed endpoints under <code className="font-mono text-cobalt">{siteConfig.apiBaseUrl}</code>: <code className="font-mono">POST /resumes</code>, <code className="font-mono">POST /sessions</code>. Only <code className="font-mono">GET /health</code> exists today.
          </p>
        </aside>
      </div>
    </Container>
  );
}
