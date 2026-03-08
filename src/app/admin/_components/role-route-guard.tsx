"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient, useSession } from "@/lib/auth-client";
import { BARBER_ALLOWED_ROUTES } from "@/lib/permissions";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Guard that checks the active member's role and redirects barbers
 * away from pages they are not allowed to access.
 */
export function RoleRouteGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const { data: activeMember, isLoading } = useQuery({
    queryKey: ["active-member"],
    queryFn: async () => {
      const result = await authClient.organization.getActiveMember();
      return result.data;
    },
    enabled: !!session?.user,
  });

  useEffect(() => {
    if (isLoading || !activeMember) return;

    if (activeMember.role === "barber") {
      const isAllowed = (BARBER_ALLOWED_ROUTES as readonly string[]).some(
        (route) => pathname === route || pathname.startsWith(route + "/"),
      );
      if (!isAllowed) {
        router.replace("/admin/agendamentos");
        return;
      }
    }

    setAllowed(true);
  }, [activeMember, isLoading, pathname, router]);

  if (isLoading || !allowed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
