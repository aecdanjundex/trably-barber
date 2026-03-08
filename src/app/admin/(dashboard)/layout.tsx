import { AdminAuthGuard } from "../_components/admin-auth-guard";
import { AdminLayoutShell } from "../_components/admin-sidebar";
import { RoleRouteGuard } from "../_components/role-route-guard";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <AdminLayoutShell>
        <RoleRouteGuard>{children}</RoleRouteGuard>
      </AdminLayoutShell>
    </AdminAuthGuard>
  );
}
