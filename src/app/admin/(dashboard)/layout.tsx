import { AdminAuthGuard } from "../_components/admin-auth-guard";
import { AdminLayoutShell } from "../_components/admin-sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminAuthGuard>
  );
}
