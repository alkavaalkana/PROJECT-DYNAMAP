import { useEffect, useState } from 'react';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Smoothly animates a displayed integer from 0 (or previous value) up to target
 * strictly for real recorded metrics, bypassing animation if prefers-reduced-motion is active.
 */
export function useCountUp(target: number, durationMs = 520): number {
  const [displayValue, setDisplayValue] = useState<number>(() =>
    prefersReducedMotion() ? target : 0
  );

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayValue(target);
      return;
    }

    let frameId = 0;
    const startVal = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return displayValue;
}
