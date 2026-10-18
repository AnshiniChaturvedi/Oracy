import { siteConfig } from "@/lib/site";

/**
 * Thin API client. Only `getHealth` maps to an endpoint that exists today.
 *
 * PROPOSED (not implemented in the backend; see docs/API_DESIGN.md):
 *   POST /resumes, POST /sessions, POST /sessions/{id}/answers,
 *   GET /jobs/{id}, GET /sessions/{id}/readiness, GET /sessions/{id}/feedback,
 *   GET /dashboard/summary, GET /dashboard/sessions
 */
export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch(`${siteConfig.apiBaseUrl}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Health check failed (${res.status})`);
  return res.json();
}
