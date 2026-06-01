"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export function RoleRouteGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (session !== undefined) setReady(true);
  }, [session]);

  if (!ready) return null;

  return <>{children}</>;
}
