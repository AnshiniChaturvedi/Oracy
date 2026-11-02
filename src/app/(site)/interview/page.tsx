import type { Metadata } from "next";
import { Suspense } from "react";
import { InterviewSetup } from "@/features/interview/InterviewSetup";

export const metadata: Metadata = { title: "Start Your Interview" };

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper pt-32 text-center text-mute font-mono text-xs">Loading interview...</div>}>
      <InterviewSetup />
    </Suspense>
  );
}
