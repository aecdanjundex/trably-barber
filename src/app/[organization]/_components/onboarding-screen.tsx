"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, Mail } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Org {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
}

interface Props {
  org: Org;
  onComplete: () => void;
}

export function OnboardingScreen({ org, onComplete }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const trpc = useTRPC();
  const updateProfile = useMutation(
    trpc.customerAuth.updateProfile.mutationOptions(),
  );

  function validate() {
    const newErrors: { name?: string; email?: string } = {};
    if (name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }
    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "E-mail inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
      });
      onComplete();
    } catch {
      setErrors({ name: "Erro ao salvar. Tente novamente." });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-16">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Bem-vindo! 👋</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Antes de agendar em{" "}
            <span className="font-medium text-amber-400">{org.name}</span>,
            precisamos de algumas informações.
          </p>
        </div>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Complete seu perfil</CardTitle>
            <CardDescription>
              Essas informações serão usadas para seus agendamentos.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Nome completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-border bg-muted pl-10"
                    autoComplete="name"
                    autoFocus
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border bg-muted pl-10"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Salvando…" : "Continuar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
