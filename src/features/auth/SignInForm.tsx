"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Icons";
import { PasswordField, TextField } from "@/components/forms/Field";
import { validateEmail } from "@/lib/validation";
import { useRedirectIfSignedIn } from "@/features/auth/useRedirectIfSignedIn";
import { signIn } from "@/services/auth";

export function SignInForm() {
  useRedirectIfSignedIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = { email: validateEmail(email), password: password ? undefined : "Enter your password." };
    setErrors(next);
    setServerError(null);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      await signIn({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-busy={loading}>
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>
      )}
      <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setErrors((p) => ({ ...p, email: validateEmail(email) }))} error={errors.email} placeholder="you@example.com" />
      <PasswordField label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} placeholder="Your password" />
      <div className="text-right text-sm">
        <Link href="/forgot-password" className="text-mute transition hover:text-cobalt">Forgot password?</Link>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (<><Spinner /> Signing in…</>) : "Sign In"}
      </Button>
    </form>
  );
}
