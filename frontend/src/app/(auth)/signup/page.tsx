import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/AuthShell";
import { SignUpForm } from "@/features/auth/SignUpForm";

export const metadata: Metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Begin."
      subtitle="Create an account to explore ORACY."
      footer={<>Already have an account? <Link href="/login" className="text-cobalt underline-offset-4 hover:underline">Sign in</Link></>}
    >
      <SignUpForm />
    </AuthShell>
  );
}
