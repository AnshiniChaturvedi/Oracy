"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/hooks/useSession";

/** Sends an already signed-in (demo) user to the dashboard. */
export function useRedirectIfSignedIn() {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);
}
