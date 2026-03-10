"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

/**
 * Intercepts all fetch responses within the dashboard.
 * When any API call returns 401, it signs the user out
 * and redirects to the login page.
 */
const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const intercepted = useRef(false);

  useEffect(() => {
    if (intercepted.current) return;
    intercepted.current = true;

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (response.status === 401) {
        const url =
          typeof args[0] === "string" ? args[0] : args[0]?.toString?.() || "";

        // Only intercept internal API calls, not external requests
        if (
          url.startsWith("/api/") ||
          url.startsWith(window.location.origin + "/api/")
        ) {
          signOut({ callbackUrl: "/login" });
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
};

export default SessionGuard;
