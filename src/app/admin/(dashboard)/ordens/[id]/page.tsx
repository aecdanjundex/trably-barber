"use client";

import { useState, use } from "react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Zap,
  DollarSign,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lock,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Link from "next/link";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatPercentage(basisPoints: number) {
  return `${(basisPoints / 100).toFixed(2)}%`;
}

const STATUS_LABELS: Record<string, string> = {
  open: "Aberta",
  completed: "Concluída",
  cancelled: "Cancelada",
};

export default function OrdemDetalhe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: order, isLoading } = useQuery(
    trpc.serviceOrder.getServiceOrder.queryOptions({ id }),
  );

  const { data: services } = useQuery(trpc.admin.listServices.queryOptions());
  const { data: products } = useQuery(
    trpc.serviceOrder.listProducts.queryOptions(),
  );
  const { data: paymentMethods } = useQuery(
    trpc.serviceOrder.listPaymentMethods.queryOptions(),
  );
  const { data: quickItems } = useQuery(
    trpc.serviceOrder.listQuickItems.queryOptions(),
  );
  const { data: customers } = useQuery(trpc.admin.listCustomers.queryOptions());
  const { data: planData } = useQuery(
    trpc.subscription.getCurrentPlan.queryOptions(),
  );
  const isPremium = planData?.plan === "premium";
  const { data: org } = useQuery({
    queryKey: ["active-organization"],
    queryFn: async () => {
      const result = await authClient.organization.getFullOrganization();
      return result.data;
    },
  });

  const members = org?.members ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.serviceOrder.getServiceOrder.queryKey({ id }),
    });

  // ─── Mutations ────────────────────────────────────────────────────────────

  const updateOrderMutation = useMutation(
    trpc.serviceOrder.updateServiceOrder.mutationOptions({
      onSuccess: () => invalidate(),
    }),
  );

  const addItemMutation = useMutation(
    trpc.serviceOrder.addServiceOrderItem.mutationOptions({
      onSuccess: () => {
        invalidate();
        setItemDialogOpen(false);
        resetItemForm();
      },
    }),
  );

  const updateItemMutation = useMutation(
    trpc.serviceOrder.updateServiceOrderItem.mutationOptions({
      onSuccess: () => {
        invalidate();
        setEditItemDialogOpen(false);
      },
    }),
  );

  const removeItemMutation = useMutation(
    trpc.serviceOrder.removeServiceOrderItem.mutationOptions({
      onSuccess: () => invalidate(),
    }),
  );

  const addPaymentMutation = useMutation(
    trpc.serviceOrder.addPayment.mutationOptions({
      onSuccess: () => {
        invalidate();
        setPaymentDialogOpen(false);
        resetPaymentForm();
      },
    }),
  );

  const removePaymentMutation = useMutation(
    trpc.serviceOrder.removePayment.mutationOptions({
      onSuccess: () => invalidate(),
    }),
  );

  // Also duplicate (redo) mutation
  const createOrderMutation = useMutation(
    trpc.serviceOrder.createServiceOrder.mutationOptions({
      onSuccess: (newOrder) => {
        router.push(`/admin/ordens/${newOrder.id}`);
      },
    }),
  );

  // ─── Item dialog state ────────────────────────────────────────────────────

  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemType, setItemType] = useState<"service" | "product">("service");
  const [itemReferenceId, setItemReferenceId] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [itemNotes, setItemNotes] = useState("");
  const [itemProfessionalIds, setItemProfessionalIds] = useState<string[]>([]);
  const [itemComboOpen, setItemComboOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [customerComboOpen, setCustomerComboOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  function resetItemForm() {
    setItemType("service");
    setItemReferenceId("");
    setItemQuantity("1");
    setItemNotes("");
    setItemProfessionalIds([]);
    setItemSearch("");
  }

  function submitItem(e: React.FormEvent) {
    e.preventDefault();
    if (!itemReferenceId) return;
    addItemMutation.mutate({
      serviceOrderId: id,
      itemType,
      referenceId: itemReferenceId,
      quantity: parseInt(itemQuantity) || 1,
      notes: itemNotes || undefined,
      professionalIds: itemProfessionalIds.length
        ? itemProfessionalIds
        : undefined,
    });
  }

  // ─── Quick item handler ────────────────────────────────────────────────────

  function handleQuickItem(qi: NonNullable<typeof quickItems>[number]) {
    addItemMutation.mutate({
      serviceOrderId: id,
      itemType: qi.itemType as "service" | "product",
      referenceId: qi.referenceId,
      quantity: 1,
    });
  }

  // ─── Edit item dialog state ───────────────────────────────────────────────

  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState("");
  const [editItemQuantity, setEditItemQuantity] = useState("1");
  const [editItemPrice, setEditItemPrice] = useState("");
  const [editItemNotes, setEditItemNotes] = useState("");
  const [editItemProfessionals, setEditItemProfessionals] = useState<
    {
      professionalId: string;
      commissionType: "fixed" | "percentage";
      fixedValueInCents?: number;
      percentageValue?: number;
    }[]
  >([]);

  function openEditItem(item: NonNullable<typeof order>["items"][number]) {
    setEditingItemId(item.id);
    setEditItemQuantity(String(item.quantity));
    setEditItemPrice((item.unitPriceInCents / 100).toFixed(2));
    setEditItemNotes(item.notes ?? "");
    setEditItemProfessionals(
      item.professionals.map((p) => ({
        professionalId: p.professionalId,
        commissionType: p.commissionType as "fixed" | "percentage",
        fixedValueInCents: p.fixedValueInCents ?? undefined,
        percentageValue: p.percentageValue ?? undefined,
      })),
    );
    setEditItemDialogOpen(true);
  }

  function submitEditItem(e: React.FormEvent) {
    e.preventDefault();
    updateItemMutation.mutate({
      id: editingItemId,
      quantity: parseInt(editItemQuantity) || 1,
      unitPriceInCents: Math.round(parseFloat(editItemPrice) * 100) || 0,
      notes: editItemNotes || null,
      professionals: editItemProfessionals,
    });
  }

  // ─── Payment dialog state ─────────────────────────────────────────────────

  const [removePaymentId, setRemovePaymentId] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  function resetPaymentForm() {
    setPaymentMethodId("");
    setPaymentAmount("");
    setPaymentNotes("");
  }

  function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    addPaymentMutation.mutate({
      serviceOrderId: id,
      paymentMethodId,
      amountInCents: Math.round(parseFloat(paymentAmount) * 100) || 0,
      notes: paymentNotes || undefined,
    });
  }

  // ─── Professional helper for inline editing ────────────────────────────────

  type ProfessionalEntry = {
    professionalId: string;
    commissionType: "fixed" | "percentage";
    fixedValueInCents?: number;
    percentageValue?: number;
  };

  function addProfessional(
    list: ProfessionalEntry[],
    setList: (list: ProfessionalEntry[]) => void,
  ) {
    setList([
      ...list,
      {
        professionalId: "",
        commissionType: "percentage",
        percentageValue: 0,
      },
    ]);
  }

  function removeProfessional(
    idx: number,
    list: ProfessionalEntry[],
    setList: (list: ProfessionalEntry[]) => void,
  ) {
    setList(list.filter((_, i) => i !== idx));
  }

  function updateProfessional(
    idx: number,
    field: string,
    value: string | number,
    list: ProfessionalEntry[],
    setList: (list: ProfessionalEntry[]) => void,
  ) {
    const updated = [...list];
    (updated[idx] as any)[field] = value;
    if (field === "commissionType") {
      if (value === "fixed") {
        updated[idx].percentageValue = undefined;
        updated[idx].fixedValueInCents = 0;
      } else {
        updated[idx].fixedValueInCents = undefined;
        updated[idx].percentageValue = 0;
      }
    }
    setList(updated);
  }

  // ─── Redo order ────────────────────────────────────────────────────────────

  function handleRedo() {
    if (!order) return;
    createOrderMutation.mutate({
      customerId: order.customerId ?? undefined,
      notes: order.notes ?? undefined,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Ordem não encontrada</p>
        <Button variant="outline" asChild>
          <Link href="/admin/ordens">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  const balance = order.totalInCents - order.totalPaidInCents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/ordens">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Ordem de Serviço
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)} •{" "}
              <Badge
                variant={
                  order.status === "open"
                    ? "default"
                    : order.status === "completed"
                      ? "secondary"
                      : "destructive"
                }
              >
                {STATUS_LABELS[order.status] ?? order.status}
              </Badge>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {order.status === "open" && (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  updateOrderMutation.mutate({
                    id: order.id,
                    status: "completed",
                  })
                }
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Concluir
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  updateOrderMutation.mutate({
                    id: order.id,
                    status: "cancelled",
                  })
                }
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleRedo}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Refazer
          </Button>
        </div>
      </div>

      {/* Customer selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={customerComboOpen} onOpenChange={setCustomerComboOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
              >
                <span className="truncate">
                  {order.customerId
                    ? (() => {
                        const c = (customers ?? []).find((c) => c.id === order.customerId);
                        return c
                          ? `${c.name}${c.phone ? ` — ${c.phone}` : ""}`
                          : order.customerId;
                      })()
                    : "Sem cliente"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Buscar cliente..."
                  value={customerSearch}
                  onValueChange={setCustomerSearch}
                />
                <CommandList>
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="__none__"
                      onSelect={() => {
                        updateOrderMutation.mutate({ id: order.id, customerId: null });
                        setCustomerComboOpen(false);
                        setCustomerSearch("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !order.customerId ? "opacity-100" : "opacity-0",
                        )}
                      />
                      Sem cliente
                    </CommandItem>
                    {(customers ?? [])
                      .filter((c) =>
                        `${c.name} ${c.phone ?? ""}`.toLowerCase().includes(customerSearch.toLowerCase()),
                      )
                      .map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.id}
                          onSelect={() => {
                            updateOrderMutation.mutate({ id: order.id, customerId: c.id });
                            setCustomerComboOpen(false);
                            setCustomerSearch("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              order.customerId === c.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {c.name}{c.phone ? ` — ${c.phone}` : ""}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Quick items */}
      {quickItems && quickItems.length > 0 && order.status === "open" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-4 w-4" />
              Adicionar Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickItems
                .filter((qi) => qi.active)
                .map((qi) => (
                  <Button
                    key={qi.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickItem(qi)}
                    disabled={addItemMutation.isPending}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {qi.label} — {formatPrice(qi.referencePriceInCents)}
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Itens</CardTitle>
          {order.status === "open" && (
            <Button size="sm" onClick={() => setItemDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!order.items.length ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum item adicionado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Qtde</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Profissional(is)</TableHead>
                  <TableHead>Obs.</TableHead>
                  {order.status === "open" && (
                    <TableHead className="w-24">Ações</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {item.itemType === "service" ? "Serviço" : "Produto"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatPrice(item.unitPriceInCents)}</TableCell>
                    <TableCell>
                      {formatPrice(item.unitPriceInCents * item.quantity)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.professionals.length ? (
                        <div className="space-y-0.5">
                          {item.professionals.map((p) => (
                            <div key={p.id} className="flex items-center gap-1">
                              <span>{p.professionalName}</span>
                              <Badge variant="secondary" className="text-xs">
                                {p.commissionType === "fixed"
                                  ? formatPrice(p.fixedValueInCents ?? 0)
                                  : formatPercentage(p.percentageValue ?? 0)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate text-sm text-muted-foreground">
                      {item.notes ?? "—"}
                    </TableCell>
                    {order.status === "open" && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditItem(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeItemMutation.mutate({ id: item.id })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Totals + Payments */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Faturado</span>
              <span className="font-semibold">
                {formatPrice(order.totalInCents)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Recebido</span>
              <span className="font-semibold text-green-600">
                {formatPrice(order.totalPaidInCents)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Saldo</span>
              <span
                className={`font-bold ${balance > 0 ? "text-yellow-600" : balance === 0 ? "text-green-600" : "text-red-600"}`}
              >
                {balance > 0
                  ? `Falta ${formatPrice(balance)}`
                  : balance === 0
                    ? "Pago"
                    : `Troco ${formatPrice(Math.abs(balance))}`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-4 w-4" />
              Pagamentos
            </CardTitle>
            {order.status === "open" && (
              <Button size="sm" onClick={() => setPaymentDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Pagamento
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!order.payments.length ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum pagamento registrado
              </p>
            ) : (
              <div className="space-y-2">
                {order.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="font-medium">
                        {formatPrice(p.amountInCents)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {p.paymentMethodName} • {formatDate(p.paidAt)}
                      </div>
                      {p.notes && (
                        <div className="text-xs text-muted-foreground">
                          {p.notes}
                        </div>
                      )}
                    </div>
                    {order.status === "open" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRemovePaymentId(p.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observações da Ordem</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Observações gerais..."
            defaultValue={order.notes ?? ""}
            onBlur={(e) => {
              if (e.target.value !== (order.notes ?? "")) {
                updateOrderMutation.mutate({
                  id: order.id,
                  notes: e.target.value,
                });
              }
            }}
            disabled={order.status !== "open"}
          />
        </CardContent>
      </Card>

      {/* ─── Add Item Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={itemDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setItemDialogOpen(false);
            resetItemForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
            <DialogDescription>
              Adicione um serviço ou produto à ordem de serviço
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitItem} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-0 space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={itemType}
                  onValueChange={(v) => {
                    setItemType(v as "service" | "product");
                    setItemReferenceId("");
                    setItemSearch("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {itemType === "service" ? "Serviço" : "Produto"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Serviço</SelectItem>
                    <SelectItem value="product">Produto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-2">
                <Label>{itemType === "service" ? "Serviço" : "Produto"}</Label>
                <Popover open={itemComboOpen} onOpenChange={setItemComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {itemReferenceId
                          ? ((itemType === "service" ? services : products)?.find(
                              (r) => r.id === itemReferenceId,
                            )?.name ?? itemReferenceId)
                          : "Selecione..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Buscar..."
                        value={itemSearch}
                        onValueChange={setItemSearch}
                      />
                      <CommandList>
                        <CommandEmpty>Nenhum resultado.</CommandEmpty>
                        <CommandGroup>
                          {(itemType === "service"
                            ? (services ?? [])
                            : (products ?? [])
                          )
                            .filter((r) =>
                              r.name.toLowerCase().includes(itemSearch.toLowerCase()),
                            )
                            .map((r) => (
                              <CommandItem
                                key={r.id}
                                value={r.name}
                                onSelect={() => {
                                  setItemReferenceId(r.id);
                                  setItemComboOpen(false);
                                  setItemSearch("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    itemReferenceId === r.id ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {r.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Qtde</Label>
                <Input
                  type="number"
                  min={1}
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                />
              </div>
              <div className="min-w-0 space-y-2">
                <Label className="flex items-center gap-1">
                  Profissional
                  {!isPremium && <Lock className="h-3 w-3 text-muted-foreground" />}
                </Label>
                {isPremium ? (
                  <Select
                    value={itemProfessionalIds[0] ?? "none"}
                    onValueChange={(v) =>
                      setItemProfessionalIds(v === "none" ? [] : [v])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione...">
                        {itemProfessionalIds[0]
                          ? (members.find(
                              (m) => m.userId === itemProfessionalIds[0],
                            )?.user.name ?? itemProfessionalIds[0])
                          : "Nenhum"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {members.map((m) => (
                        <SelectItem key={m.userId} value={m.userId}>
                          {m.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground gap-1">
                    <Lock className="h-3 w-3" />
                    Disponível no Premium
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="Observação do item (opcional)"
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setItemDialogOpen(false);
                  resetItemForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={addItemMutation.isPending || !itemReferenceId}
              >
                {addItemMutation.isPending ? "Adicionando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Item Dialog ────────────────────────────────────────────── */}
      <Dialog
        open={editItemDialogOpen}
        onOpenChange={(open) => !open && setEditItemDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitEditItem} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Qtde</Label>
                <Input
                  type="number"
                  min={1}
                  value={editItemQuantity}
                  onChange={(e) => setEditItemQuantity(e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Preço Unit. (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={editItemPrice}
                  onChange={(e) => setEditItemPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={editItemNotes}
                onChange={(e) => setEditItemNotes(e.target.value)}
                placeholder="Observação do item (opcional)"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  Profissionais
                  {!isPremium && <Lock className="h-3 w-3 text-muted-foreground" />}
                </Label>
                {isPremium ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addProfessional(
                        editItemProfessionals,
                        setEditItemProfessionals,
                      )
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Adicionar
                  </Button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Premium
                  </span>
                )}
              </div>
              {editItemProfessionals.map((p, idx) => (
                <ProfessionalRow
                  key={idx}
                  professional={p}
                  members={members}
                  onUpdate={(field, value) =>
                    updateProfessional(
                      idx,
                      field,
                      value,
                      editItemProfessionals,
                      setEditItemProfessionals,
                    )
                  }
                  onRemove={() =>
                    removeProfessional(
                      idx,
                      editItemProfessionals,
                      setEditItemProfessionals,
                    )
                  }
                />
              ))}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditItemDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateItemMutation.isPending}>
                {updateItemMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Payment Dialog ──────────────────────────────────────────────── */}
      <Dialog
        open={paymentDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPaymentDialogOpen(false);
            resetPaymentForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              Saldo restante: {formatPrice(balance > 0 ? balance : 0)}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitPayment} className="space-y-4">
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select
                value={paymentMethodId}
                onValueChange={setPaymentMethodId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione...">
                    {paymentMethodId
                      ? ((paymentMethods ?? []).find(
                          (m) => m.id === paymentMethodId,
                        )?.name ?? paymentMethodId)
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(paymentMethods ?? [])
                    .filter((m) => m.active)
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min={0.01}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label>Observação (opcional)</Label>
              <Input
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setPaymentDialogOpen(false);
                  resetPaymentForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={addPaymentMutation.isPending || !paymentMethodId}
              >
                {addPaymentMutation.isPending ? "Registrando..." : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Remove Payment Confirmation ─────────────────────────────────── */}
      <AlertDialog
        open={!!removePaymentId}
        onOpenChange={(open) => !open && setRemovePaymentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover recebimento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removePaymentId) {
                  removePaymentMutation.mutate({ id: removePaymentId });
                  setRemovePaymentId(null);
                }
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Professional Row Component ──────────────────────────────────────────────

function ProfessionalRow({
  professional,
  members,
  onUpdate,
  onRemove,
}: {
  professional: {
    professionalId: string;
    commissionType: "fixed" | "percentage";
    fixedValueInCents?: number;
    percentageValue?: number;
  };
  members: { userId: string; user: { name: string } }[];
  onUpdate: (field: string, value: string | number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-end gap-2 rounded-md border p-2">
      <div className="min-w-0 flex-1 space-y-1">
        <Label className="text-xs">Profissional</Label>
        <Select
          value={professional.professionalId}
          onValueChange={(v) => onUpdate("professionalId", v)}
        >
          <SelectTrigger className="h-8 w-full text-sm">
            <SelectValue placeholder="Selecione...">
              {professional.professionalId
                ? (members.find((m) => m.userId === professional.professionalId)
                    ?.user.name ?? professional.professionalId)
                : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {members.map((m) => (
              <SelectItem key={m.userId} value={m.userId}>
                {m.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-28 space-y-1">
        <Label className="text-xs">Tipo</Label>
        <Select
          value={professional.commissionType}
          onValueChange={(v) => onUpdate("commissionType", v)}
        >
          <SelectTrigger className="h-8 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fixo</SelectItem>
            <SelectItem value="percentage">%</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-24 space-y-1">
        <Label className="text-xs">
          {professional.commissionType === "fixed" ? "R$" : "%"}
        </Label>
        <Input
          className="h-8 text-sm"
          type="number"
          step="0.01"
          min={0}
          value={
            professional.commissionType === "fixed"
              ? ((professional.fixedValueInCents ?? 0) / 100).toFixed(2)
              : ((professional.percentageValue ?? 0) / 100).toFixed(2)
          }
          onChange={(e) => {
            const val = Math.round(parseFloat(e.target.value) * 100);
            if (professional.commissionType === "fixed") {
              onUpdate("fixedValueInCents", isNaN(val) ? 0 : val);
            } else {
              onUpdate("percentageValue", isNaN(val) ? 0 : val);
            }
          }}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={onRemove}
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </Button>
    </div>
  );
}
