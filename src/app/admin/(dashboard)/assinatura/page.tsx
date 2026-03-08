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
import Script from "next/script";
import { clientEnv } from "@/lib/env/client";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "pricing-table-id": string;
          "publishable-key": string;
          "client-reference-id"?: string;
        },
        HTMLElement
      >;
    }
  }
}

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

export default function AssinaturaPage() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();

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

  const isSuccess = searchParams.get("success") === "1";
  const isCanceled = searchParams.get("canceled") === "1";

  const hasActivePaidPlan =
    planInfo &&
    (planInfo.plan === "basic" || planInfo.plan === "premium") &&
    planInfo.status === "active";

  const currentPeriodInvoice = invoices.find((inv) => inv.status === "paid");

  const showPricingTable =
    !hasActivePaidPlan &&
    clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    clientEnv.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID;

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
                {currentPeriodInvoice && (
                  <p>
                    Período atual:{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(currentPeriodInvoice.periodFrom)}
                    </span>
                    {" até "}
                    <span className="font-medium text-foreground">
                      {formatDate(currentPeriodInvoice.periodTo)}
                    </span>
                  </p>
                )}
                {planInfo.currentPeriodEndsAt && (
                  <p>
                    Próxima cobrança em{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(planInfo.currentPeriodEndsAt)}
                    </span>
                    {planInfo.interval === "annual" ? " · Plano anual" : " · Plano mensal"}.
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

      {/* Stripe Pricing Table */}
      {showPricingTable && (
        <>
          <Script src="https://js.stripe.com/v3/pricing-table.js" />
          <stripe-pricing-table
            pricing-table-id={clientEnv.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
            publishable-key={clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            client-reference-id={planInfo?.orgId}
          />
        </>
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
