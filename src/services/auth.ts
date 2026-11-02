import { siteConfig } from "@/lib/site";

export interface Session {
  name: string;
  email: string;
}

interface AuthUser {
  name: string;
  email: string;
}

const KEY = "oracy.demo.session";
const EVENT = "oracy:session-change";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

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
      return { name: data.name, email: data.email };
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
    throw new Error("Your browser blocked local storage, so your session could not be saved.");
  }
  window.dispatchEvent(new Event(EVENT));
}

async function getErrorMessage(response: Response, action: string): Promise<string> {
  const errorData = (await response.json().catch(() => ({}))) as { detail?: unknown };
  return typeof errorData.detail === "string"
    ? errorData.detail
    : `${action} failed with status ${response.status}`;
}

export async function signIn(input: { email: string; password: string }): Promise<Session> {
  const response = await fetch(`${siteConfig.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Sign-in"));
  }

  const user = (await response.json()) as AuthUser;
  const session: Session = { name: user.name, email: user.email };
  persist(session);
  return session;
}

export async function signUp(input: { name: string; email: string; password: string }): Promise<Session> {
  const response = await fetch(`${siteConfig.apiBaseUrl}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Sign-up"));
  }

  const user = (await response.json()) as AuthUser;
  const session: Session = { name: user.name, email: user.email };
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
