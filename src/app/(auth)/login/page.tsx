import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/AuthShell";
import { SignInForm } from "@/features/auth/SignInForm";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back."
      subtitle="Sign in to see your dashboard preview."
      footer={<>New to ORACY? <Link href="/signup" className="text-cobalt underline-offset-4 hover:underline">Create an account</Link></>}
    >
      <SignInForm />
    </AuthShell>
  );
}
