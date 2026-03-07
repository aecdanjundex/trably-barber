"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Scissors } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
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

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Nome é obrigatório"),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginValues>();
  const signupForm = useForm<SignupValues>();

  async function handleLogin(data: LoginValues) {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        setError(result.error.message ?? "Erro ao fazer login");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(data: SignupValues) {
    setError(null);
    setLoading(true);
    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      if (result.error) {
        setError(result.error.message ?? "Erro ao criar conta");
      } else {
        router.push("/admin");
      }
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
          <CardTitle className="text-2xl">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Acesse o painel da sua barbearia"
              : "Crie sua conta para gerenciar sua barbearia"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "login" ? (
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...loginForm.register("email", {
                    required: "Email obrigatório",
                  })}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...loginForm.register("password", {
                    required: "Senha obrigatória",
                    minLength: { value: 8, message: "Mínimo 8 caracteres" },
                  })}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Não tem conta?{" "}
                <a
                  href="/cadastro"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Cadastrar barbearia
                </a>
              </p>
            </form>
          ) : (
            <form
              onSubmit={signupForm.handleSubmit(handleSignup)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  {...signupForm.register("name", {
                    required: "Nome obrigatório",
                  })}
                />
                {signupForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {signupForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="seu@email.com"
                  {...signupForm.register("email", {
                    required: "Email obrigatório",
                  })}
                />
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  {...signupForm.register("password", {
                    required: "Senha obrigatória",
                    minLength: { value: 8, message: "Mínimo 8 caracteres" },
                  })}
                />
                {signupForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {signupForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando..." : "Criar conta"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Já tem conta?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                >
                  Entrar
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
