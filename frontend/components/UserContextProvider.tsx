"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// A separate component to inject user info as needed.
// For some reason, this was a pain in the ass to do...

export default function UserContextProvider({
  user,
  children,
}: {
  user: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Use this hook to track route changes

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      // Inject the user context when the page loads or navigates
      window.__USER__ = user;
    }
  }, [user, pathname]); // re-run on route change

  return <>{children}</>;
}
