"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  DollarSign,
  LogOut,
  Menu,
  Building2,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  owner: "Dono",
  admin: "Admin",
  staff: "Colaborador",
};

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Clientes", href: "/admin/clientes", icon: Users },
  { title: "Ordens de Serviço", href: "/admin/ordens", icon: ClipboardList },
  { title: "Financeiro", href: "/admin/financeiro", icon: DollarSign },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const { data: activeMember } = useQuery({
    queryKey: ["active-member"],
    queryFn: async () => {
      const result = await authClient.organization.getActiveMember();
      return result.data;
    },
    enabled: !!session?.user,
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <span className="text-lg font-bold">Trably CRM</span>
        </div>
        {session?.user && (
          <div className="mt-1 flex items-center gap-2">
            <p className="truncate text-sm text-muted-foreground">
              {session.user.name}
            </p>
            {activeMember?.role && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {ROLE_LABELS[activeMember.role] ?? activeMember.role}
              </Badge>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      className={cn(isActive && "bg-accent text-accent-foreground")}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={async () => {
              await signOut();
              router.push("/admin/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <AdminTopNav />
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}

function AdminTopNav() {
  const { data: org } = useQuery({
    queryKey: ["active-organization"],
    queryFn: async () => {
      const result = await authClient.organization.getFullOrganization();
      return result.data;
    },
  });

  return (
    <div className="flex items-center gap-3 border-b px-4 py-3">
      <SidebarTrigger className="md:hidden">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      {org ? (
        <span className="text-sm font-semibold">{org.name}</span>
      ) : (
        <span className="text-sm text-muted-foreground">Carregando…</span>
      )}
    </div>
  );
}
