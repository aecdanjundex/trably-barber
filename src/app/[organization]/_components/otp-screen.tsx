"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

interface Org {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
}

interface Props {
  org: Org;
  phone: string;
  onBack: () => void;
  onSuccess: (token: string, customerId: string) => void;
}

export function OtpScreen({ org, phone, onBack, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const trpc = useTRPC();
  const verifyOtp = useMutation(trpc.customerAuth.verifyOtp.mutationOptions());

  const displayPhone = phone.startsWith("+55")
    ? phone.replace("+55", "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    : phone;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("Digite o código de 6 dígitos.");
      return;
    }

    try {
      const result = await verifyOtp.mutateAsync({
        slug: org.slug ?? "",
        phone,
        code,
      });
      onSuccess(result.token, result.customerId);
    } catch {
      setError("Código inválido ou expirado. Tente novamente.");
      setCode("");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-16">
      <div className="mx-auto w-full max-w-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-10 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl">Código enviado!</CardTitle>
            <CardDescription>
              Enviamos um SMS para{" "}
              <span className="font-medium text-amber-400">{displayPhone}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Código de verificação
                </Label>
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="size-12 border-border bg-muted text-lg font-bold"
                    />
                    <InputOTPSlot
                      index={1}
                      className="size-12 border-border bg-muted text-lg font-bold"
                    />
                    <InputOTPSlot
                      index={2}
                      className="size-12 border-border bg-muted text-lg font-bold"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="size-12 border-border bg-muted text-lg font-bold"
                    />
                    <InputOTPSlot
                      index={4}
                      className="size-12 border-border bg-muted text-lg font-bold"
                    />
                    <InputOTPSlot
                      index={5}
                      className="size-12 border-border bg-muted text-lg font-bold"
                    />
                  </InputOTPGroup>
                </InputOTP>
                {error && (
                  <p className="text-center text-xs text-destructive">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={code.length !== 6 || verifyOtp.isPending}
                className="h-11 w-full bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300"
                size="lg"
              >
                {verifyOtp.isPending ? "Verificando..." : "Confirmar código"}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground/50">
              O código expira em 10 minutos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
