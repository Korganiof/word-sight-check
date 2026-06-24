import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { nextRoute } from "@/lib/flow";

/**
 * Returns a `goToNext` callback that advances from the current route to the
 * next step of the screening battery (see `src/lib/flow.ts`). Components call it
 * once they've saved their result, without needing to know what comes next.
 */
export function useScreeningFlow(): () => void {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(() => navigate(nextRoute(pathname)), [navigate, pathname]);
}
