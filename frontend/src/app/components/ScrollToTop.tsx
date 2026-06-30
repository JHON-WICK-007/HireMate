"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    let cancelled = false;
    let rafId: number;

    function onCancel() {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onCancel);
    }

    window.addEventListener("scroll", onCancel);

    const duration = 2000;
    const start = window.scrollY;
    const startTime = performance.now();

    function step(currentTime: number) {
      if (cancelled) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        window.removeEventListener("scroll", onCancel);
      }
    }

    rafId = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onCancel);
    };
  }, [pathname]);

  return null;
}
