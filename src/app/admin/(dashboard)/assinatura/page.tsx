"use client";

import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Clock, X, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function PlanBadge({ plan, status }: { plan: string; status: string | null }) {
  if (plan === "trial") {
    return <Badge variant="secondary">Trial</Badge>;
  }
  if (plan === "free") {
    return <Badge variant="outline">Gratuito</Badge>;
  }
  if (status === "active") {
    return <Badge className="bg-green-500 text-white">Ativo</Badge>;
  }
  if (status === "past_due") {
    return <Badge variant="destructive">Pagamento pendente</Badge>;
  }
  if (status === "canceled") {
    return <Badge variant="destructive">Cancelado</Badge>;
  }
  return <Badge variant="outline">{plan}</Badge>;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return null;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
    new Date(date),
  );
}

const PLANS = [
  {
    id: "basic" as const,
    name: "Básico",
    description: "Para barbearias que estão começando",
    monthlyPrice: 69,
    annualPrice: 599,
    annualMonthly: Math.round(599 / 12),
    features: [
      "Agendamentos ilimitados",
      "Até 3 profissionais",
      "Relatórios básicos",
      "Suporte por e-mail",
    ],
  },
  {
    id: "premium" as const,
    name: "Premium",
    description: "Para barbearias em crescimento",
    monthlyPrice: 149,
    annualPrice: 1199,
    annualMonthly: Math.round(1199 / 12),
    features: [
      "Agendamentos ilimitados",
      "Profissionais ilimitados",
      "Relatórios avançados",
      "Suporte prioritário",
      "Personalização da página",
      "Integração com WhatsApp",
    ],
    highlighted: true,
  },
];

export default function AssinaturaPage() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const [checkoutPending, setCheckoutPending] = useState<string | null>(null);

  const { data: planInfo, isLoading } = useQuery(
    trpc.subscription.getPlanInfo.queryOptions(),
  );

  const { data: invoices = [] } = useQuery(
    trpc.subscription.getInvoices.queryOptions(),
  );

  const startTrialMutation = useMutation(
    trpc.subscription.startTrial.mutationOptions({
      onSuccess: () => window.location.reload(),
    }),
  );

  const portalMutation = useMutation(
    trpc.subscription.createPortalSession.mutationOptions({
      onSuccess: ({ url }) => {
        window.location.href = url;
      },
    }),
  );

  const checkoutMutation = useMutation(
    trpc.subscription.createCheckoutSession.mutationOptions({
      onSuccess: ({ url }) => {
        window.location.href = url;
      },
      onSettled: () => setCheckoutPending(null),
    }),
  );

  const isSuccess = searchParams.get("success") === "1";
  const isCanceled = searchParams.get("canceled") === "1";

  const hasActivePaidPlan =
    planInfo &&
    (planInfo.plan === "basic" || planInfo.plan === "premium") &&
    planInfo.status === "active";

  const currentPeriodInvoice = invoices.find((inv) => inv.status === "paid");

  const showPricingCards = !hasActivePaidPlan;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assinatura</h1>
        <p className="text-muted-foreground">
          Gerencie o plano da sua barbearia
        </p>
      </div>

      {/* Feedback banners */}
      {isSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          Assinatura ativada com sucesso! Obrigado por assinar.
        </div>
      )}
      {isCanceled && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
          O pagamento foi cancelado. Você pode tentar novamente quando quiser.
        </div>
      )}

      {/* Current plan status */}
      {planInfo && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Plano atual</p>
                <CardTitle className="capitalize">
                  {planInfo.plan === "free"
                    ? "Gratuito"
                    : planInfo.plan === "trial"
                      ? "Trial"
                      : planInfo.plan === "basic"
                        ? "Básico"
                        : "Premium"}
                </CardTitle>
              </div>
              <PlanBadge plan={planInfo.plan} status={planInfo.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {planInfo.plan === "trial" && planInfo.trialEndsAt && (
              <p>
                Seu trial encerra em{" "}
                <span className="font-medium text-foreground">
                  {formatDate(planInfo.trialEndsAt)}
                </span>
                . Faça upgrade para continuar usando sem interrupções.
              </p>
            )}
            {planInfo.plan === "free" && (
              <p>
                Você está no plano gratuito. Inicie um trial de 15 dias ou
                assine diretamente para acessar todos os recursos.
              </p>
            )}
            {hasActivePaidPlan && (
              <div className="space-y-1">
                {planInfo.currentPeriodStartsAt && planInfo.currentPeriodEndsAt && (
                  <p>
                    Período atual:{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(planInfo.currentPeriodStartsAt)}
                    </span>
                    {" até "}
                    <span className="font-medium text-foreground">
                      {formatDate(planInfo.currentPeriodEndsAt)}
                    </span>
                    {planInfo.interval === "annual" ? " · Plano anual" : " · Plano mensal"}.
                  </p>
                )}
                {planInfo.currentPeriodEndsAt && (
                  <p>
                    Próxima cobrança em{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(planInfo.currentPeriodEndsAt)}
                    </span>.
                  </p>
                )}
              </div>
            )}
            {planInfo.status === "past_due" && (
              <p className="text-red-600">
                Seu pagamento está pendente. Acesse o portal de cobrança para
                regularizar.
              </p>
            )}
          </CardContent>
          {hasActivePaidPlan && (
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
              >
                {portalMutation.isPending
                  ? "Redirecionando..."
                  : "Gerenciar assinatura"}
              </Button>
            </CardFooter>
          )}
          {planInfo.status === "past_due" && (
            <CardFooter>
              <Button
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
              >
                {portalMutation.isPending ? "Redirecionando..." : "Regularizar pagamento"}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Trial CTA for free plan */}
      {planInfo?.plan === "free" && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Experimente grátis por 15 dias
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Acesse todos os recursos do plano Básico sem custo algum durante
            15 dias. Sem necessidade de cartão de crédito.
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => startTrialMutation.mutate()}
              disabled={startTrialMutation.isPending}
            >
              {startTrialMutation.isPending
                ? "Ativando..."
                : "Iniciar trial gratuito"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Pricing cards */}
      {showPricingCards && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Escolha um plano</h2>
            {/* Interval toggle */}
            <div className="flex items-center gap-1 rounded-lg border p-1">
              <button
                onClick={() => setInterval("monthly")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  interval === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setInterval("annual")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  interval === "annual"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anual
                <span className={`text-xs font-semibold ${interval === "annual" ? "text-primary-foreground/80" : "text-green-600"}`}>
                  -30%
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PLANS.map((plan) => {
              const price = interval === "monthly" ? plan.monthlyPrice : plan.annualMonthly;
              const totalPrice = interval === "annual" ? plan.annualPrice : null;
              const isCurrentPlan = planInfo?.plan === plan.id;
              const key = `${plan.id}-${interval}`;

              return (
                <Card
                  key={plan.id}
                  className={plan.highlighted ? "border-primary shadow-md" : ""}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                      </div>
                      {plan.highlighted && (
                        <Badge className="bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        R$ {price}
                      </span>
                      <span className="text-muted-foreground">/mês</span>
                      {totalPrice && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Cobrado R$ {totalPrice.toLocaleString("pt-BR")}/ano
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 shrink-0 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      disabled={isCurrentPlan || checkoutMutation.isPending}
                      onClick={() => {
                        setCheckoutPending(key);
                        checkoutMutation.mutate({ plan: plan.id, interval });
                      }}
                    >
                      {checkoutPending === key && checkoutMutation.isPending
                        ? "Redirecionando..."
                        : isCurrentPlan
                          ? "Plano atual"
                          : "Assinar"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Billing history */}
      {invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de cobranças</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Período</th>
                  <th className="px-6 py-3 font-medium">Plano</th>
                  <th className="px-6 py-3 font-medium">Valor</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="px-6 py-3 text-muted-foreground">
                      {formatDate(inv.periodFrom)}
                      {" – "}
                      {formatDate(inv.periodTo)}
                    </td>
                    <td className="px-6 py-3 capitalize">
                      {inv.plan === "basic"
                        ? "Básico"
                        : inv.plan === "premium"
                          ? "Premium"
                          : (inv.plan ?? "—")}
                      {inv.planInterval && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({inv.planInterval === "annual" ? "anual" : "mensal"})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {(inv.amountInCents / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-6 py-3">
                      {inv.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <Check className="h-3.5 w-3.5" />
                          Pago
                        </span>
                      ) : inv.status === "open" ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600">
                          <Clock className="h-3.5 w-3.5" />
                          Pendente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <X className="h-3.5 w-3.5" />
                          Falhou
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
