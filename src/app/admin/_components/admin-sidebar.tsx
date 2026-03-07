"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Scissors,
  Users,
  CalendarDays,
  UserCircle,
  LogOut,
  Menu,
} from "lucide-react";
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
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Serviços", href: "/admin/servicos", icon: Scissors },
  { title: "Equipe", href: "/admin/equipe", icon: Users },
  { title: "Agendamentos", href: "/admin/agendamentos", icon: CalendarDays },
  { title: "Clientes", href: "/admin/clientes", icon: UserCircle },
];

export function AdminSidebar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          <span className="text-lg font-bold">Trably Barber</span>
        </div>
        {session?.user && (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {session.user.name}
          </p>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton onClick={() => router.push(item.href)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={async () => {
            await signOut();
            router.push("/admin/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex items-center gap-2 border-b px-4 py-3 md:hidden">
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <span className="font-semibold">Trably Barber</span>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
