"use client";

import { use, useState } from "react";
import { ArrowLeft, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "Aberta", variant: "outline" },
  in_progress: { label: "Em andamento", variant: "default" },
  completed: { label: "Concluída", variant: "secondary" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery(
    trpc.serviceOrder.getById.queryOptions({ id }),
  );
  const { data: services } = useQuery(trpc.serviceOrder.listServices.queryOptions());
  const { data: products } = useQuery(trpc.serviceOrder.listProducts.queryOptions());
  const { data: paymentMethods } = useQuery(trpc.serviceOrder.listPaymentMethods.queryOptions());

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: trpc.serviceOrder.getById.queryKey({ id }) });

  const updateMutation = useMutation(
    trpc.serviceOrder.update.mutationOptions({ onSuccess: invalidate }),
  );
  const addItemMutation = useMutation(
    trpc.serviceOrder.addItem.mutationOptions({ onSuccess: invalidate }),
  );
  const removeItemMutation = useMutation(
    trpc.serviceOrder.removeItem.mutationOptions({ onSuccess: invalidate }),
  );
  const addPaymentMutation = useMutation(
    trpc.serviceOrder.addPayment.mutationOptions({ onSuccess: invalidate }),
  );
  const removePaymentMutation = useMutation(
    trpc.serviceOrder.removePayment.mutationOptions({ onSuccess: invalidate }),
  );

  const [addItemOpen, setAddItemOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  const [itemForm, setItemForm] = useState({
    itemType: "service" as "service" | "product",
    referenceId: "",
    name: "",
    quantity: 1,
    unitPriceInCents: 0,
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentMethodId: "",
    amountInCents: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-40 lg:col-span-2" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-muted-foreground">Ordem não encontrada</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/admin/ordens">Voltar</Link>
        </Button>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, variant: "outline" as const };
  const canEdit = order.status === "open" || order.status === "in_progress";

  function handleSelectServiceItem(type: "service" | "product", refId: string) {
    const catalog = type === "service" ? services : products;
    const item = catalog?.find((s) => s.id === refId);
    if (item) {
      setItemForm((f) => ({
        ...f,
        itemType: type,
        referenceId: refId,
        name: item.name,
        unitPriceInCents: item.priceInCents,
      }));
    }
  }

  function handleAddItem() {
    addItemMutation.mutate(
      {
        serviceOrderId: id,
        ...itemForm,
        referenceId: itemForm.referenceId || undefined,
      },
      {
        onSuccess: () => {
          setAddItemOpen(false);
          setItemForm({ itemType: "service", referenceId: "", name: "", quantity: 1, unitPriceInCents: 0 });
        },
      },
    );
  }

  function handleAddPayment() {
    addPaymentMutation.mutate(
      {
        serviceOrderId: id,
        paymentMethodId: paymentForm.paymentMethodId,
        amountInCents: paymentForm.amountInCents,
      },
      {
        onSuccess: () => {
          setAddPaymentOpen(false);
          setPaymentForm({ paymentMethodId: "", amountInCents: 0 });
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/ordens">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">OS #{order.number}</h1>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        {canEdit && (
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateMutation.mutate({ id, status: "completed" })}
              disabled={updateMutation.isPending}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Concluir
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateMutation.mutate({ id, status: "cancelled" })}
              disabled={updateMutation.isPending}
            >
              <XCircle className="mr-1 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Itens da Ordem</CardTitle>
              {canEdit && (
                <Button size="sm" onClick={() => setAddItemOpen(true)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Adicionar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {order.items.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhum item adicionado
                </p>
              ) : (
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity}x ·{" "}
                          {formatCurrency(item.unitPriceInCents)}/un
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {formatCurrency(item.quantity * item.unitPriceInCents)}
                        </span>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeItemMutation.mutate({
                                itemId: item.id,
                                serviceOrderId: id,
                              })
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Pagamentos</CardTitle>
              {canEdit && (
                <Button size="sm" onClick={() => setAddPaymentOpen(true)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Registrar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {order.payments.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhum pagamento registrado
                </p>
              ) : (
                <div className="space-y-2">
                  {order.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{p.paymentMethodName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.paidAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-green-600">
                          {formatCurrency(p.amountInCents)}
                        </span>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removePaymentMutation.mutate({
                                paymentId: p.id,
                                serviceOrderId: id,
                              })
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {order.clientName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente</span>
                  <span className="font-medium">{order.clientName}</span>
                </div>
              )}
              {order.assignedToName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Responsável</span>
                  <span className="font-medium">{order.assignedToName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="border-t pt-3 space-y-2">
                {order.discountInCents > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Desconto</span>
                    <span>- {formatCurrency(order.discountInCents)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalInCents)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Pago</span>
                  <span>{formatCurrency(order.paidInCents)}</span>
                </div>
                {order.balanceInCents > 0 && (
                  <div className="flex justify-between text-orange-600 font-medium">
                    <span>Saldo</span>
                    <span>{formatCurrency(order.balanceInCents)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {canEdit && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Alterar status</p>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => updateMutation.mutate({ id, status: "in_progress" })}
                disabled={updateMutation.isPending || order.status === "in_progress"}
              >
                Em andamento
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add item dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Tipo</label>
              <Select
                value={itemForm.itemType}
                onValueChange={(v) => setItemForm((f) => ({ ...f, itemType: v as "service" | "product", referenceId: "", name: "", unitPriceInCents: 0 }))}
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
            <div>
              <label className="mb-1 block text-sm">
                {itemForm.itemType === "service" ? "Serviço" : "Produto"}
              </label>
              <Select
                value={itemForm.referenceId}
                onValueChange={(v) => handleSelectServiceItem(itemForm.itemType, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar…" />
                </SelectTrigger>
                <SelectContent>
                  {(itemForm.itemType === "service" ? services : products)?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — {formatCurrency(s.priceInCents)}
                    </SelectItem>
                  ))}
                  <SelectItem value="_manual">Digitar manualmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(itemForm.referenceId === "_manual" || !itemForm.referenceId) && (
              <>
                <div>
                  <label className="mb-1 block text-sm">Nome</label>
                  <Input
                    value={itemForm.name}
                    onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nome do item"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Preço (R$)</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={itemForm.unitPriceInCents / 100}
                    onChange={(e) =>
                      setItemForm((f) => ({
                        ...f,
                        unitPriceInCents: Math.round(parseFloat(e.target.value || "0") * 100),
                      }))
                    }
                    placeholder="0,00"
                  />
                </div>
              </>
            )}
            <div>
              <label className="mb-1 block text-sm">Quantidade</label>
              <Input
                type="number"
                min={1}
                value={itemForm.quantity}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, quantity: parseInt(e.target.value || "1") }))
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddItemOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={addItemMutation.isPending || !itemForm.name}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add payment dialog */}
      <Dialog open={addPaymentOpen} onOpenChange={setAddPaymentOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Forma de Pagamento</label>
              <Select
                value={paymentForm.paymentMethodId}
                onValueChange={(v) => setPaymentForm((f) => ({ ...f, paymentMethodId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar…" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods?.map((pm) => (
                    <SelectItem key={pm.id} value={pm.id}>
                      {pm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm">Valor (R$)</label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={paymentForm.amountInCents / 100 || ""}
                placeholder={`Saldo: ${formatCurrency(order.balanceInCents)}`}
                onChange={(e) =>
                  setPaymentForm((f) => ({
                    ...f,
                    amountInCents: Math.round(parseFloat(e.target.value || "0") * 100),
                  }))
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddPaymentOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleAddPayment}
                disabled={
                  addPaymentMutation.isPending ||
                  !paymentForm.paymentMethodId ||
                  paymentForm.amountInCents <= 0
                }
              >
                Registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
