"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Icons";
import { TextField } from "@/components/forms/Field";
import { validateEmail } from "@/lib/validation";
import { useRedirectIfSignedIn } from "@/features/auth/useRedirectIfSignedIn";
import { requestPasswordReset } from "@/services/auth";

export function ForgotPasswordForm() {
  useRedirectIfSignedIn();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    setServerError(null);
    if (err) return;

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setDone(true);
    } catch (e2) {
      setServerError(e2 instanceof Error ? e2.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-display text-3xl">Request recorded</h2>
        <p className="mt-3 text-ink/70">No email was sent because there is no password-reset backend yet. In the real product, a reset link would go to {email.trim()}.</p>
        <Link href="/login" className="mt-5 inline-block text-cobalt underline-offset-4 hover:underline">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-busy={loading}>
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>
      )}
      <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} placeholder="you@example.com" />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (<><Spinner /> Sending…</>) : "Send Reset Link"}
      </Button>
    </form>
  );
}
