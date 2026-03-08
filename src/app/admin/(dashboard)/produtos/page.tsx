"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type ProductFormData = {
  name: string;
  priceInCents: number;
  active: boolean;
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function ProdutosPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery(
    trpc.serviceOrder.listProducts.queryOptions(),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    defaultValues: { name: "", priceInCents: 0, active: true },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.serviceOrder.listProducts.queryKey(),
    });

  const createMutation = useMutation(
    trpc.serviceOrder.createProduct.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.serviceOrder.updateProduct.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const toggleActiveMutation = useMutation(
    trpc.serviceOrder.updateProduct.mutationOptions({
      onSuccess: () => invalidate(),
    }),
  );

  function openCreate() {
    setEditingId(null);
    form.reset({ name: "", priceInCents: 0, active: true });
    setDialogOpen(true);
  }

  function openEdit(p: NonNullable<typeof products>[number]) {
    setEditingId(p.id);
    form.reset({
      name: p.name,
      priceInCents: p.priceInCents,
      active: p.active,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    form.reset();
  }

  function onSubmit(data: ProductFormData) {
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
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos vendidos pela sua barbearia
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !products?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">Nenhum produto cadastrado</p>
          <Button variant="outline" className="mt-4" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar primeiro produto
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{formatPrice(p.priceInCents)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={p.active}
                        onCheckedChange={(val) =>
                          toggleActiveMutation.mutate({ id: p.id, active: val })
                        }
                        disabled={toggleActiveMutation.isPending}
                      />
                      <span className="text-sm text-muted-foreground">
                        {p.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(p)}
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

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Atualize as informações do produto"
                : "Preencha os dados do novo produto"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prod-name">Nome</Label>
              <Input
                id="prod-name"
                placeholder="Ex: Pomada modeladora"
                {...form.register("name", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-price">Preço (R$)</Label>
              <Input
                id="prod-price"
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
            <div className="flex items-center gap-2">
              <Switch
                id="prod-active"
                checked={form.watch("active")}
                onCheckedChange={(val) => form.setValue("active", val)}
              />
              <Label htmlFor="prod-active">Produto ativo</Label>
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
