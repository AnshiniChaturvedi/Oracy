"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Container, Eyebrow } from "@/components/Container";
import { ArrowRight } from "@/components/Icons";
import { TextField } from "@/components/forms/Field";
import { MAX_RESUME_MB, siteConfig } from "@/lib/site";
import { validateResumeFile } from "@/lib/validation";
import { analyzeResume, type ResumeAnalysisResult } from "@/services/api";
import { LiveInterviewRoom } from "./LiveInterviewRoom";

const roles = ["Data Analyst", "Python Developer", "Software Developer", "Machine Learning Engineer", "Frontend Developer"];

export function InterviewSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const startParam = searchParams.get("start");

  const [role, setRole] = useState(() => searchParams.get("role") || "");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ role?: string; file?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resumeRequiredError, setResumeRequiredError] = useState("");
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLiveInterview, setIsLiveInterview] = useState(false);

  function requestStartInterview() {
    if (!result) {
      setResumeRequiredError("First upload your resume and complete analysis before starting the interview.");
      setErrors((prev) => ({ ...prev, file: "First upload your resume" }));
      router.replace("/interview");
      const resumeElem = document.getElementById("resume");
      if (resumeElem) {
        resumeElem.scrollIntoView({ behavior: "smooth", block: "center" });
        resumeElem.focus();
      }
      return;
    }
    setIsLiveInterview(true);
  }

  // Listen for the custom "start-interview" event triggered by the navbar button
  useEffect(() => {
    function onStart() {
      if (!result) {
        setResumeRequiredError("First upload your resume and complete analysis before starting the interview.");
        setErrors((prev) => ({ ...prev, file: "First upload your resume" }));
        router.replace("/interview");
        const resumeElem = document.getElementById("resume");
        if (resumeElem) {
          resumeElem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        setIsLiveInterview(true);
      }
    }
    window.addEventListener("start-interview", onStart);
    return () => window.removeEventListener("start-interview", onStart);
  }, [result, router]);

  // If URL has ?mode=live or ?start=true, enforce that resume analysis must exist first
  useEffect(() => {
    if (modeParam === "live" || startParam === "true") {
      if (!result) {
        setResumeRequiredError("First upload your resume and complete analysis before starting the interview.");
        setErrors((prev) => ({ ...prev, file: "First upload your resume" }));
        router.replace("/interview");
      } else {
        setIsLiveInterview(true);
      }
    }
  }, [modeParam, startParam, result, router]);

  const isLive = isLiveInterview && result !== null;

  if (isLive) {
    return (
      <LiveInterviewRoom
        role={role.trim() || result?.comparison.target_role || "Designer"}
        onExit={() => {
          setIsLiveInterview(false);
          router.push("/interview");
        }}
      />
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = { role: role.trim() ? undefined : "Enter a target role.", file: validateResumeFile(file, MAX_RESUME_MB) };
    setErrors(next);
    setServerError("");
    setResumeRequiredError("");
    setResult(null);
    if (next.role || next.file || !file) return;

    setLoading(true);
    try {
      setResult(await analyzeResume(file, role.trim()));
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Resume analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="pb-28 pt-32 md:pt-40">
      <Eyebrow>Interview setup</Eyebrow>
      <h1 className="mt-6 max-w-3xl font-display text-display">Analyze your resume for a <span className="italic text-cobalt">role.</span></h1>
      <p className="mt-6 max-w-2xl text-lg text-ink/65">Choose a role and upload your resume to see an evidence-based match analysis.</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <form onSubmit={onSubmit} noValidate className="space-y-6 lg:col-span-7">
          {resumeRequiredError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-bad/30 bg-bad/5 p-4 text-bad shadow-sm"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bad/20 text-bad font-bold text-xs">
                !
              </div>
              <div>
                <h3 className="font-semibold text-sm">First upload your resume</h3>
                <p className="mt-0.5 text-xs text-bad/85">
                  {resumeRequiredError}
                </p>
              </div>
            </div>
          )}

          <div>
            <TextField label="Target role" list="roles" value={role} onChange={(e) => setRole(e.target.value)} error={errors.role} placeholder="e.g. Python Developer" />
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
            {errors.file && <p className="mt-2 text-sm text-red-600 font-medium">{errors.file}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze resume"} {!loading && <ArrowRight />}
            </Button>
          </div>

          {serverError && (
            <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {result && (
            <section aria-live="polite" className="space-y-5 rounded-2xl border border-line bg-card p-6">
              <div>
                <h2 className="font-display text-3xl">
                  {result.status === "role_match" ? "Strong role match" : "Role match needs work"}
                </h2>
                <p className="mt-2 text-ink/70">
                  {result.comparison.match_score}% match for {result.comparison.target_role}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-mute">
                  Analysis: {result.analysis_source === "llm" ? "AI-powered" : "skills-based"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium">
                    {result.analysis_source === "llm" ? "Requirements met" : "Matched skills"}
                  </h3>
                  <p className="mt-1 text-sm text-ink/70">
                    {result.comparison.matched_skills.join(", ") || "No matched skills"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">
                    {result.analysis_source === "llm" ? "Requirements to build" : "Skills to build"}
                  </h3>
                  <p className="mt-1 text-sm text-ink/70">
                    {result.comparison.missing_skills.join(", ") || "No missing skills"}
                  </p>
                </div>
              </div>

              {result.llm_analysis && (
                <div className="space-y-4 border-t border-line pt-4">
                  <div>
                    <h3 className="font-medium">Why this match</h3>
                    <p className="mt-1 text-sm text-ink/70">{result.llm_analysis.fit_rationale}</p>
                  </div>
                  {result.llm_analysis.extracted_skills.length > 0 && (
                    <div>
                      <h3 className="font-medium">Skills found in your resume</h3>
                      <ul className="mt-1 space-y-1 text-sm text-ink/70">
                        {result.llm_analysis.extracted_skills.map((skill) => (
                          <li key={skill.name}>
                            <span className="font-medium">{skill.name}:</span> {skill.evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.llm_analysis.relevant_projects.length > 0 && (
                    <div>
                      <h3 className="font-medium">Relevant projects</h3>
                      <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-ink/70">
                        {result.llm_analysis.relevant_projects.map((project) => (
                          <li key={project}>{project}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.llm_analysis.experience_summary.length > 0 && (
                    <div>
                      <h3 className="font-medium">Experience highlights</h3>
                      <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-ink/70">
                        {result.llm_analysis.experience_summary.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {result.suggested_roles.length > 0 && (
                <div>
                  <h3 className="font-medium">Other roles to consider</h3>
                  <ul className="mt-1 space-y-1 text-sm text-ink/70">
                    {result.suggested_roles.map((suggestion) => (
                      <li key={suggestion.role}>
                        <span className="font-medium">{suggestion.role} — {suggestion.match_score}% match</span>
                        {suggestion.rationale && <span>: {suggestion.rationale}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Start Interview Action Banner (Unlocked after analysis) */}
              <div className="mt-6 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 bg-cobalt/5 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <div>
                  <h3 className="font-display text-lg text-ink">Ready for your live interview?</h3>
                  <p className="text-xs text-ink/70">
                    Resume analyzed successfully ({result.comparison.match_score}% match). Open your camera and start your interview for {result.comparison.target_role}.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setIsLiveInterview(true)}
                  className="w-full sm:w-auto shadow-lift flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M15 10l5-5v14l-5-5" />
                    <path d="M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                  </svg>
                  Start Interview <ArrowRight />
                </Button>
              </div>
            </section>
          )}
        </form>

        <aside className="rounded-3xl border border-line bg-card p-8 lg:col-span-5 space-y-6">
          <div>
            <h2 className="font-display text-title">AI resume analysis</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Choose from {roles.join(", ")}. With AI configured, extracted resume text is sent to Google Gemini / OpenAI, and other roles are also supported. API:{" "}
              <code className="font-mono text-cobalt">{siteConfig.apiBaseUrl}</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <h3 className="font-display text-base text-ink">Interview with Camera</h3>
            <p className="mt-1.5 text-xs text-ink/70 leading-relaxed">
              {result
                ? "Your resume has been analyzed! Click below to open your camera and start the interview."
                : "Upload your resume first. Once the AI analyzes your fit, the live camera interview session will unlock."}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
