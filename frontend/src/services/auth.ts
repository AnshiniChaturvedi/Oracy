/**
 * Authentication service — FRONTEND-ONLY DEMO.
 *
 * The backend currently exposes only `GET /api/v1/health`. There are no
 * auth endpoints, so nothing here talks to a server, creates a real account,
 * or verifies a password. A demo session (name + email only, never a
 * password) is kept in localStorage so the UI flow can be previewed.
 *
 * INTEGRATION POINTS (proposed, not implemented in the backend):
 *   signIn               -> POST   {API}/auth/login
 *   signUp               -> POST   {API}/auth/register
 *   requestPasswordReset -> POST   {API}/auth/password-reset
 *   signOut              -> POST   {API}/auth/logout
 *   getSession           -> GET    {API}/auth/me
 * Replace the bodies below and keep the exported signatures.
 */

export interface Session {
  name: string;
  email: string;
  demo: true;
}

const KEY = "oracy.demo.session";
const EVENT = "oracy:session-change";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function readRawSession(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseSession(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<Session>;
    if (typeof data.name === "string" && typeof data.email === "string") {
      return { name: data.name, email: data.email, demo: true };
    }
  } catch {
    /* ignore corrupt value */
  }
  return null;
}

export function subscribeSession(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function persist(session: Session) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    throw new Error("Your browser blocked local storage, so the demo session could not be saved.");
  }
  window.dispatchEvent(new Event(EVENT));
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const clean = local.replace(/[._-]+/g, " ").trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Guest";
}

export async function signIn(input: { email: string; password: string }): Promise<Session> {
  await wait(900); // simulated latency
  const session: Session = { name: nameFromEmail(input.email), email: input.email.trim(), demo: true };
  persist(session);
  return session;
}

export async function signUp(input: { name: string; email: string; password: string }): Promise<Session> {
  await wait(1100);
  const session: Session = { name: input.name.trim(), email: input.email.trim(), demo: true };
  persist(session);
  return session;
}

export async function requestPasswordReset(email: string): Promise<void> {
  void email;
  await wait(900); // no email is sent in demo mode
}

export async function signOut(): Promise<void> {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}
