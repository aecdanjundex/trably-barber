"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, UserCircle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

type CustomerFormData = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default function ClientesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery(
    trpc.admin.listCustomers.queryOptions(),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<CustomerFormData>({
    defaultValues: { name: "", phone: "", email: "", notes: "" },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.admin.listCustomers.queryKey(),
    });

  const createMutation = useMutation(
    trpc.admin.createCustomer.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.admin.updateCustomer.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const toggleActiveMutation = useMutation(
    trpc.admin.updateCustomer.mutationOptions({
      onSuccess: () => invalidate(),
    }),
  );

  function openCreate() {
    setEditingId(null);
    form.reset({ name: "", phone: "", email: "", notes: "" });
    setDialogOpen(true);
  }

  function openEdit(c: NonNullable<typeof customers>[number]) {
    setEditingId(c.id);
    form.reset({
      name: c.name,
      phone: c.phone,
      email: c.email ?? "",
      notes: c.notes ?? "",
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    form.reset();
  }

  function onSubmit(data: CustomerFormData) {
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        notes: data.notes || null,
      });
    } else {
      createMutation.mutate({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        notes: data.notes || undefined,
      });
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes da sua barbearia
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !customers?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <UserCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
          <Button variant="outline" className="mt-4" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar primeiro cliente
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.email ?? "—"}
                  </TableCell>
                  <TableCell className="max-w-50 truncate text-muted-foreground">
                    {c.notes ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={c.active}
                        onCheckedChange={(val) =>
                          toggleActiveMutation.mutate({ id: c.id, active: val })
                        }
                        disabled={toggleActiveMutation.isPending}
                      />
                      <span className="text-sm text-muted-foreground">
                        {c.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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
              {editingId ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Atualize as informações do cliente"
                : "Preencha os dados do novo cliente"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cust-name">Nome</Label>
              <Input
                id="cust-name"
                placeholder="Nome completo"
                {...form.register("name", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cust-phone">Telefone</Label>
              <Input
                id="cust-phone"
                placeholder="(11) 99999-9999"
                {...form.register("phone", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cust-email">Email (opcional)</Label>
              <Input
                id="cust-email"
                type="email"
                placeholder="cliente@email.com"
                {...form.register("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cust-notes">Observações (opcional)</Label>
              <Textarea
                id="cust-notes"
                placeholder="Preferências, alergias, etc."
                {...form.register("notes")}
              />
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
