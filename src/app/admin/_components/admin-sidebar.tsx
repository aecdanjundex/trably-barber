"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Scissors,
  Users,
  CalendarDays,
  Timer,
  UserCircle,
  LogOut,
  Menu,
  Link2,
  Check,
  Copy,
  Clock,
  ClipboardList,
  Package,
  CreditCard,
  Percent,
  Zap,
  BarChart3,
  Wallet,
  Receipt,
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
import { useTRPC } from "@/trpc/utils";
import { clientEnv } from "@/lib/env/client";
import { useState, useMemo } from "react";
import { BARBER_FREE_ROUTES, BARBER_ALLOWED_ROUTES } from "@/lib/permissions";

const ROLE_LABELS: Record<string, string> = {
  owner: "Dono",
  admin: "Admin",
  barber: "Barbeiro",
  member: "Membro",
};

const allNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, premiumOnly: false },
  { title: "Ordens de Serviço", href: "/admin/ordens", icon: ClipboardList, premiumOnly: false },
  { title: "Serviços", href: "/admin/servicos", icon: Scissors, premiumOnly: false },
  { title: "Produtos", href: "/admin/produtos", icon: Package, premiumOnly: false },
  {
    title: "Formas de Pagamento",
    href: "/admin/formas-pagamento",
    icon: CreditCard,
    premiumOnly: false,
  },
  { title: "Comissões", href: "/admin/comissoes", icon: Percent, premiumOnly: true },
  {
    title: "Pagamento de Comissões",
    href: "/admin/pagamento-comissoes",
    icon: Wallet,
    premiumOnly: true,
  },
  { title: "Relatórios", href: "/admin/relatorios", icon: BarChart3, premiumOnly: false },
  { title: "Itens Rápidos", href: "/admin/itens-rapidos", icon: Zap, premiumOnly: false },
  { title: "Equipe", href: "/admin/equipe", icon: Users, premiumOnly: false },
  { title: "Fila de Espera", href: "/admin/fila-de-espera", icon: Timer, premiumOnly: false },
  { title: "Agenda", href: "/admin/agenda", icon: Clock, premiumOnly: false },
  { title: "Agendamentos", href: "/admin/agendamentos", icon: CalendarDays, premiumOnly: false },
  { title: "Clientes", href: "/admin/clientes", icon: UserCircle, premiumOnly: false },
  { title: "Assinatura", href: "/admin/assinatura", icon: Receipt, premiumOnly: false },
];

export function AdminSidebar() {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: session } = useSession();

  const { data: activeMember, isLoading: isLoadingMember } = useQuery({
    queryKey: ["active-member"],
    queryFn: async () => {
      const result = await authClient.organization.getActiveMember();
      return result.data;
    },
    enabled: !!session?.user,
  });

  const { data: planData } = useQuery({
    ...trpc.subscription.getCurrentPlan.queryOptions(),
    enabled: !!session?.user,
  });

  const isPremium = planData?.plan === "premium";

  const navItems = useMemo(() => {
    if (isLoadingMember) return [];
    const items = isPremium
      ? allNavItems
      : allNavItems.filter((item) => !item.premiumOnly);
    if (activeMember?.role === "barber") {
      const allowed = isPremium ? BARBER_ALLOWED_ROUTES : BARBER_FREE_ROUTES;
      return items.filter((item) =>
        (allowed as readonly string[]).includes(item.href),
      );
    }
    return items;
  }, [activeMember?.role, isLoadingMember, isPremium]);

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          <span className="text-lg font-bold">Trably Barber</span>
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
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton render={<Link href={item.href} />}>
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

  const [copied, setCopied] = useState(false);

  const bookingUrl = org?.slug
    ? (() => {
        const url = new URL(clientEnv.NEXT_PUBLIC_APP_URL);
        return `${url.protocol}//${org.slug}.${url.host}`;
      })()
    : null;

  function handleCopy() {
    if (!bookingUrl) return;
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        {org ? (
          <span className="text-sm font-semibold">{org.name}</span>
        ) : (
          <span className="text-sm font-semibold text-muted-foreground">
            Carregando…
          </span>
        )}
      </div>

      {bookingUrl && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">{bookingUrl}</span>
          <span className="sm:hidden">Copiar link</span>
          {!copied && <Copy className="h-3 w-3 text-muted-foreground" />}
        </Button>
      )}
    </div>
  );
}
