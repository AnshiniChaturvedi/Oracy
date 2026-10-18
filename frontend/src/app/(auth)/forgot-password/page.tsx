import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset access."
      subtitle="Enter your email and we’ll show how a reset would work."
      footer={<>Remembered it? <Link href="/login" className="text-cobalt underline-offset-4 hover:underline">Back to sign in</Link></>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
