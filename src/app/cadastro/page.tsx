"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Scissors } from "lucide-react";
import { signUp, authClient } from "@/lib/auth-client";
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

const registerSchema = z.object({
  ownerName: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  barbershopName: z.string().min(2, "Nome da barbearia é obrigatório"),
  slug: z
    .string()
    .min(2, "Slug é obrigatório")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Apenas letras minúsculas, números e hífens",
    ),
});

type RegisterValues = z.infer<typeof registerSchema>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CadastroPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterValues>({
    defaultValues: {
      ownerName: "",
      email: "",
      password: "",
      barbershopName: "",
      slug: "",
    },
  });

  async function handleRegister(data: RegisterValues) {
    setError(null);
    setLoading(true);
    try {
      // 1. Create the user account
      const signUpResult = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.ownerName,
      });

      if (signUpResult.error) {
        setError(signUpResult.error.message ?? "Erro ao criar conta");
        setLoading(false);
        return;
      }

      // 2. Create the organization (barbershop) — user becomes owner
      const orgResult = await authClient.organization.create({
        name: data.barbershopName,
        slug: data.slug,
      });

      if (orgResult.error) {
        setError(orgResult.error.message ?? "Erro ao criar barbearia");
        setLoading(false);
        return;
      }

      // 3. Set the new org as active
      await authClient.organization.setActive({
        organizationId: orgResult.data.id,
      });

      // 4. Redirect to admin panel
      router.push("/admin");
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
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
          <CardTitle className="text-2xl">Cadastrar barbearia</CardTitle>
          <CardDescription>
            Crie sua conta e registre sua barbearia na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="barbershopName">Nome da barbearia</Label>
              <Input
                id="barbershopName"
                placeholder="Barbearia do João"
                {...form.register("barbershopName", {
                  required: "Nome da barbearia obrigatório",
                  onChange: (e) => {
                    const slug = slugify(e.target.value);
                    form.setValue("slug", slug);
                  },
                })}
              />
              {form.formState.errors.barbershopName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.barbershopName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL da barbearia</Label>
              <div className="flex items-center gap-1">
                <Input
                  id="slug"
                  placeholder="barbearia-do-joao"
                  {...form.register("slug", {
                    required: "Slug obrigatório",
                  })}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  .trably.com
                </span>
              </div>
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              <Label htmlFor="ownerName">Seu nome</Label>
              <Input
                id="ownerName"
                placeholder="João Silva"
                {...form.register("ownerName", {
                  required: "Nome obrigatório",
                })}
              />
              {form.formState.errors.ownerName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.ownerName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@email.com"
                {...form.register("email", {
                  required: "Email obrigatório",
                })}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
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

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar barbearia"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link
                href="/admin/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
