"use client";

import { CalendarDays, Scissors, UserCircle, Users } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const trpc = useTRPC();
  const { data: stats, isLoading } = useQuery(
    trpc.admin.getDashboardStats.queryOptions(),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua barbearia</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Agendamentos Hoje"
          value={stats?.todayAppointments ?? 0}
          icon={CalendarDays}
          loading={isLoading}
        />
        <StatCard
          title="Total de Agendamentos"
          value={stats?.totalAppointments ?? 0}
          icon={CalendarDays}
          loading={isLoading}
        />
        <StatCard
          title="Clientes"
          value={stats?.totalCustomers ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title="Serviços Ativos"
          value={stats?.totalServices ?? 0}
          icon={Scissors}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
