"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";

type PaymentMethodFormData = {
  name: string;
  active: boolean;
};

export default function FormasPagamentoPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: methods, isLoading } = useQuery(
    trpc.serviceOrder.listPaymentMethods.queryOptions(),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<PaymentMethodFormData>({
    defaultValues: { name: "", active: true },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.serviceOrder.listPaymentMethods.queryKey(),
    });

  const createMutation = useMutation(
    trpc.serviceOrder.createPaymentMethod.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.serviceOrder.updatePaymentMethod.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const toggleActiveMutation = useMutation(
    trpc.serviceOrder.updatePaymentMethod.mutationOptions({
      onSuccess: () => invalidate(),
    }),
  );

  const deleteMutation = useMutation(
    trpc.serviceOrder.deletePaymentMethod.mutationOptions({
      onSuccess: () => {
        invalidate();
        setDeleteId(null);
      },
    }),
  );

  function openCreate() {
    setEditingId(null);
    form.reset({ name: "", active: true });
    setDialogOpen(true);
  }

  function openEdit(m: NonNullable<typeof methods>[number]) {
    setEditingId(m.id);
    form.reset({ name: m.name, active: m.active });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    form.reset();
  }

  function onSubmit(data: PaymentMethodFormData) {
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
          <h1 className="text-3xl font-bold tracking-tight">
            Formas de Pagamento
          </h1>
          <p className="text-muted-foreground">
            Cadastre as formas de pagamento aceitas
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Forma
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !methods?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma forma de pagamento cadastrada
          </p>
          <Button variant="outline" className="mt-4" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar primeira forma
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={m.active}
                        onCheckedChange={(val) =>
                          toggleActiveMutation.mutate({
                            id: m.id,
                            active: val,
                          })
                        }
                        disabled={toggleActiveMutation.isPending}
                      />
                      <span className="text-sm text-muted-foreground">
                        {m.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(m)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(m.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Atualize as informações"
                : "Ex: Espécie, Cartão de Crédito, Débito, Pix"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pm-name">Nome</Label>
              <Input
                id="pm-name"
                placeholder="Ex: Pix"
                {...form.register("name", { required: true })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pm-active"
                checked={form.watch("active")}
                onCheckedChange={(val) => form.setValue("active", val)}
              />
              <Label htmlFor="pm-active">Ativo</Label>
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

      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir forma de pagamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteId && deleteMutation.mutate({ id: deleteId })
              }
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
