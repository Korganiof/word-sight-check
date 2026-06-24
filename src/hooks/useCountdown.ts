import { useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  /** Total duration to count down from, in milliseconds. */
  durationMs: number;
  /** Called once when the countdown reaches zero. */
  onExpire: () => void;
  /** How often the remaining time is recomputed. Defaults to 250ms. */
  intervalMs?: number;
}

/**
 * Whole-exercise countdown timer used by the timed screening tasks.
 *
 * Drives `remainingMs` off `performance.now()` (so it stays accurate even if a
 * tick is delayed) and fires `onExpire` exactly once at zero. The latest
 * `onExpire` is captured in a ref, so the interval is established once and never
 * torn down/recreated on re-render — `durationMs` is expected to be constant.
 */
export function useCountdown({ durationMs, onExpire, intervalMs = 250 }: UseCountdownOptions): number {
  const [remainingMs, setRemainingMs] = useState(durationMs);

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const expiredRef = useRef(false);

  useEffect(() => {
    const startedAt = performance.now();
    const id = setInterval(() => {
      const remaining = Math.max(0, durationMs - (performance.now() - startedAt));
      setRemainingMs(remaining);
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(id);
        onExpireRef.current();
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [durationMs, intervalMs]);

  return remainingMs;
}
