import Link from "next/link";
import {
  Scissors,
  Calendar,
  Users,
  BarChart3,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Online",
    description:
      "Seus clientes agendam direto pelo celular, sem precisar ligar.",
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description:
      "Convide barbeiros, defina cargos e gerencie a agenda de cada um.",
  },
  {
    icon: Scissors,
    title: "Catálogo de Serviços",
    description:
      "Cadastre cortes, barba, combos com preço e duração personalizados.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Completo",
    description:
      "Acompanhe agendamentos, clientes e faturamento em tempo real.",
  },
];

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "/mês",
    description: "Para barbearias que estão começando",
    features: [
      "Até 1 barbeiro",
      "Agendamento online",
      "Catálogo de serviços",
      "Dashboard básico",
    ],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "R$ 49",
    period: "/mês",
    description: "Para barbearias que querem crescer",
    features: [
      "Barbeiros ilimitados",
      "Agendamento online",
      "Catálogo de serviços",
      "Dashboard avançado",
      "Notificações por SMS",
      "Relatórios financeiros",
      "Suporte prioritário",
    ],
    cta: "Assinar Premium",
    highlighted: true,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Trably Barber</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" render={<Link href="/admin/login" />}>
              Entrar
            </Button>
            <Button render={<Link href="/cadastro" />}>
              Cadastrar barbearia
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          <Star className="mr-1 h-3 w-3" />
          Plataforma #1 para barbearias
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Gerencie sua barbearia de forma{" "}
          <span className="text-primary">simples e profissional</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Agendamento online, gestão de equipe, catálogo de serviços e dashboard
          completo. Tudo que sua barbearia precisa em um só lugar.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/cadastro" />}>
            Cadastrar minha barbearia
          </Button>
          <Button size="lg" variant="outline" render={<a href="#planos" />}>
            Ver planos
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Tudo que você precisa
            </h2>
            <p className="mt-3 text-muted-foreground">
              Funcionalidades pensadas para o dia a dia da sua barbearia
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Planos</h2>
            <p className="mt-3 text-muted-foreground">
              Comece grátis e evolua quando precisar
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted ? "border-primary shadow-lg" : undefined
                }
              >
                <CardHeader>
                  {plan.highlighted && (
                    <Badge className="mb-2 w-fit">Mais popular</Badge>
                  )}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    render={<Link href="/cadastro" />}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scissors className="h-4 w-4" />
            <span>Trably Barber</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Trably. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
