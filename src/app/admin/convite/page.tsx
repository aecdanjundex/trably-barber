"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Scissors, CheckCircle, Loader2 } from "lucide-react";
import { authClient, signUp, useSession } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/utils";
import { useQuery } from "@tanstack/react-query";
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

type SignupFormData = {
  name: string;
  password: string;
  confirmPassword: string;
};

export default function ConvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id");

  const { data: session, isPending: sessionLoading } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const form = useForm<SignupFormData>();

  const trpc = useTRPC();
  const { data: invitationInfo, isPending: loadingInvitation } = useQuery(
    trpc.getInvitationInfo.queryOptions(
      { id: invitationId! },
      { enabled: !!invitationId },
    ),
  );

  const invitationEmail = invitationInfo?.email ?? null;
  const invitationError =
    !loadingInvitation && invitationId && !invitationInfo
      ? "Convite não encontrado ou expirado."
      : null;

  // If user is already logged in, try to accept the invitation directly
  useEffect(() => {
    if (!session?.user || !invitationId || accepting || accepted) return;

    setAccepting(true);
    authClient.organization
      .acceptInvitation({ invitationId })
      .then((result) => {
        if (result.error) {
          setError(result.error.message ?? "Erro ao aceitar convite");
          setAccepting(false);
        } else {
          setAccepted(true);
          setAccepting(false);
          if (result.data?.member?.organizationId) {
            authClient.organization
              .setActive({
                organizationId: result.data.member.organizationId,
              })
              .then(() => router.push("/admin"));
          } else {
            router.push("/admin");
          }
        }
      })
      .catch(() => {
        setError("Erro ao aceitar convite");
        setAccepting(false);
      });
  }, [session, invitationId, accepting, accepted, router]);

  if (!invitationId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Convite inválido</CardTitle>
            <CardDescription>
              O link de convite não contém um ID válido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/admin/login" />}>
              Ir para login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionLoading || accepting || loadingInvitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {accepting ? "Aceitando convite..." : "Carregando..."}
          </p>
        </div>
      </div>
    );
  }

  if (invitationError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Convite inválido</CardTitle>
            <CardDescription>{invitationError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/admin/login" />}>
              Ir para login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle>Convite aceito!</CardTitle>
            <CardDescription>
              Você agora faz parte da equipe. Redirecionando...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // User not logged in — show signup form (name + password + confirm)
  if (!session?.user && invitationEmail) {
    async function handleSignup(data: SignupFormData) {
      setError(null);

      if (data.password !== data.confirmPassword) {
        form.setError("confirmPassword", {
          message: "As senhas não coincidem",
        });
        return;
      }

      setLoading(true);
      try {
        const result = await signUp.email({
          email: invitationEmail!,
          password: data.password,
          name: data.name,
        });
        if (result.error) {
          setError(result.error.message ?? "Erro ao criar conta");
        }
        // useEffect will handle accepting the invitation after session loads
      } catch {
        setError("Erro ao criar conta");
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Aceitar convite</CardTitle>
            <CardDescription>
              Crie sua conta para aceitar o convite e acessar a barbearia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={invitationEmail} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  {...form.register("name", {
                    required: "Nome obrigatório",
                  })}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password", {
                    required: "Senha obrigatória",
                    minLength: { value: 8, message: "Mínimo 8 caracteres" },
                  })}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("confirmPassword", {
                    required: "Confirmação obrigatória",
                    validate: (value) =>
                      value === form.getValues("password") ||
                      "As senhas não coincidem",
                  })}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta e aceitar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback — should not reach here normally
  return null;
}
