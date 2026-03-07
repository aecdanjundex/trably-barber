"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Guard that checks for both an authenticated session and
 * an active organization. Redirects to /admin/login if not.
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [orgReady, setOrgReady] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/admin/login");
      return;
    }

    // Check if user has an active organization
    if (!session.session.activeOrganizationId) {
      // Try to set the first org the user belongs to
      authClient.organization
        .list()
        .then(({ data: orgs }) => {
          if (orgs && orgs.length > 0) {
            authClient.organization
              .setActive({ organizationId: orgs[0].id })
              .then(() => setOrgReady(true));
          } else {
            // No organization — still allow access (they can create one later)
            setOrgReady(true);
          }
        })
        .catch(() => setOrgReady(true));
    } else {
      setOrgReady(true);
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user || !orgReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
