import { siteConfig } from "@/lib/site";

export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch(`${siteConfig.apiBaseUrl}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Health check failed (${res.status})`);
  return res.json();
}

export interface ResumeAnalysisResult {
  status: "role_match" | "role_mismatch";
  analysis_source: "llm" | "rules";
  resume_skills: string[];
  comparison: {
    supported_role: true;
    target_role: string;
    match_score: number;
    matched_skills: string[];
    missing_skills: string[];
    extracted_skills: string[];
  };
  suggested_roles: {
    role: string;
    match_score: number;
    matched_skills: string[];
    rationale?: string;
  }[];
  llm_analysis?: {
    extracted_skills: { name: string; evidence: string }[];
    relevant_projects: string[];
    experience_summary: string[];
    role_requirements: string[];
    matched_requirements: string[];
    missing_requirements: string[];
    match_score: number;
    fit_rationale: string;
  };
}

export async function analyzeResume(file: File, targetRole: string): Promise<ResumeAnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_role", targetRole);

  const response = await fetch(`${siteConfig.apiBaseUrl}/resumes/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as { detail?: unknown } | null;
    throw new Error(
      typeof errorData?.detail === "string"
        ? errorData.detail
        : `Resume analysis failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<ResumeAnalysisResult>;
}
