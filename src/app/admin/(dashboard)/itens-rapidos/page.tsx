"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function QuickItemsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: quickItems, isLoading } = useQuery(
    trpc.serviceOrder.listQuickItems.queryOptions(),
  );
  const { data: services } = useQuery(trpc.admin.listServices.queryOptions());
  const { data: products } = useQuery(
    trpc.serviceOrder.listProducts.queryOptions(),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [itemType, setItemType] = useState<"service" | "product">("service");
  const [referenceId, setReferenceId] = useState("");
  const [label, setLabel] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [active, setActive] = useState(true);

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.serviceOrder.listQuickItems.queryKey(),
    });

  const createMutation = useMutation(
    trpc.serviceOrder.createQuickItem.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.serviceOrder.updateQuickItem.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.serviceOrder.deleteQuickItem.mutationOptions({
      onSuccess: () => {
        invalidate();
        setDeleteId(null);
      },
    }),
  );

  function openCreate() {
    setEditingId(null);
    setItemType("service");
    setReferenceId("");
    setLabel("");
    setDisplayOrder("0");
    setActive(true);
    setDialogOpen(true);
  }

  function openEdit(qi: NonNullable<typeof quickItems>[number]) {
    setEditingId(qi.id);
    setItemType(qi.itemType as "service" | "product");
    setReferenceId(qi.referenceId);
    setLabel(qi.label);
    setDisplayOrder(String(qi.displayOrder));
    setActive(qi.active);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        label,
        displayOrder: parseInt(displayOrder) || 0,
        active,
      });
    } else {
      createMutation.mutate({
        itemType,
        referenceId,
        label,
        displayOrder: parseInt(displayOrder) || 0,
        active,
      });
    }
  }

  const referenceOptions =
    itemType === "service"
      ? (services ?? []).map((s) => ({ id: s.id, name: s.name }))
      : (products ?? []).map((p) => ({ id: p.id, name: p.name }));

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Itens Rápidos
          </h1>
          <p className="text-muted-foreground">
            Configure atalhos para adicionar itens rapidamente nas ordens
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Item Rápido
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !quickItems?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">
            Nenhum item rápido cadastrado
          </p>
          <Button variant="outline" className="mt-4" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar primeiro item rápido
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Rótulo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quickItems.map((qi) => (
                <TableRow key={qi.id}>
                  <TableCell>{qi.displayOrder}</TableCell>
                  <TableCell className="font-medium">{qi.label}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {qi.itemType === "service" ? "Serviço" : "Produto"}
                    </Badge>
                  </TableCell>
                  <TableCell>{qi.referenceName}</TableCell>
                  <TableCell>
                    {formatPrice(qi.referencePriceInCents)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {qi.active ? "Sim" : "Não"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(qi)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(qi.id)}
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
              {editingId ? "Editar Item Rápido" : "Novo Item Rápido"}
            </DialogTitle>
            <DialogDescription>
              Itens rápidos aparecem como botões na tela de ordem de serviço
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            {!editingId && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={itemType}
                    onValueChange={(v) => {
                      setItemType(v as "service" | "product");
                      setReferenceId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Serviço</SelectItem>
                      <SelectItem value="product">Produto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Referência</Label>
                  <Select
                    value={referenceId}
                    onValueChange={(v) => {
                      setReferenceId(v);
                      const ref = referenceOptions.find((r) => r.id === v);
                      if (ref && !label) setLabel(ref.name);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {referenceOptions.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Rótulo (nome exibido)</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Corte de Cabelo"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordem de exibição</Label>
                <Input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Switch
                  id="qi-active"
                  checked={active}
                  onCheckedChange={setActive}
                />
                <Label htmlFor="qi-active">Ativo</Label>
              </div>
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
            <DialogTitle>Excluir item rápido</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir?
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
