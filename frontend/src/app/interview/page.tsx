"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InterviewPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/interview/setup");
  }, [router]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "var(--text-secondary)", background: "var(--surface-0)" }}>
      <p>Redirecting to setup...</p>
    </div>
  );
}
