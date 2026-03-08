"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type ServiceFormData = {
  name: string;
  description: string;
  durationMinutes: number;
  priceInCents: number;
  active: boolean;
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function ServicosPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery(
    trpc.admin.listServices.queryOptions(),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<ServiceFormData>({
    defaultValues: {
      name: "",
      description: "",
      durationMinutes: 30,
      priceInCents: 0,
      active: true,
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.admin.listServices.queryKey(),
    });

  const createMutation = useMutation(
    trpc.admin.createService.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.admin.updateService.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const toggleActiveMutation = useMutation(
    trpc.admin.updateService.mutationOptions({
      onSuccess: () => invalidate(),
    }),
  );

  function openCreate() {
    setEditingId(null);
    form.reset({
      name: "",
      description: "",
      durationMinutes: 30,
      priceInCents: 0,
      active: true,
    });
    setDialogOpen(true);
  }

  function openEdit(svc: NonNullable<typeof services>[number]) {
    setEditingId(svc.id);
    form.reset({
      name: svc.name,
      description: svc.description ?? "",
      durationMinutes: svc.durationMinutes,
      priceInCents: svc.priceInCents,
      active: svc.active,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    form.reset();
  }

  function onSubmit(data: ServiceFormData) {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pela sua barbearia
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !services?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
          <Button variant="outline" className="mt-4" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar primeiro serviço
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Disponível p/ agendamento</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((svc) => (
                <TableRow key={svc.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{svc.name}</div>
                      {svc.description && (
                        <div className="text-sm text-muted-foreground">
                          {svc.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{svc.durationMinutes} min</TableCell>
                  <TableCell>{formatPrice(svc.priceInCents)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={svc.active}
                        onCheckedChange={(val) =>
                          toggleActiveMutation.mutate({ id: svc.id, active: val })
                        }
                        disabled={toggleActiveMutation.isPending}
                      />
                      <span className="text-sm text-muted-foreground">
                        {svc.active ? "Visível" : "Oculto"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(svc)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Atualize as informações do serviço"
                : "Preencha os dados do novo serviço"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="svc-name">Nome</Label>
              <Input
                id="svc-name"
                placeholder="Ex: Corte de cabelo"
                {...form.register("name", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-desc">Descrição</Label>
              <Textarea
                id="svc-desc"
                placeholder="Descrição do serviço (opcional)"
                {...form.register("description")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="svc-duration">Duração (min)</Label>
                <Input
                  id="svc-duration"
                  type="number"
                  min={5}
                  {...form.register("durationMinutes", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-price">Preço (R$)</Label>
                <Input
                  id="svc-price"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0,00"
                  onChange={(e) => {
                    const cents = Math.round(parseFloat(e.target.value) * 100);
                    form.setValue("priceInCents", isNaN(cents) ? 0 : cents);
                  }}
                  defaultValue={
                    form.getValues("priceInCents")
                      ? (form.getValues("priceInCents") / 100).toFixed(2)
                      : ""
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="svc-active"
                checked={form.watch("active")}
                onCheckedChange={(val) => form.setValue("active", val)}
              />
              <Label htmlFor="svc-active">Serviço ativo</Label>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
