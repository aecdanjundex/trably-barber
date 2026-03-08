"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function formatPercentage(basisPoints: number) {
  return `${(basisPoints / 100).toFixed(2)}%`;
}

export default function ComissoesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: configs, isLoading } = useQuery(
    trpc.serviceOrder.listCommissionConfigs.queryOptions(),
  );

  const { data: services } = useQuery(trpc.admin.listServices.queryOptions());
  const { data: products } = useQuery(
    trpc.serviceOrder.listProducts.queryOptions(),
  );
  const { data: org } = useQuery({
    queryKey: ["active-organization"],
    queryFn: async () => {
      const result = await authClient.organization.getFullOrganization();
      return result.data;
    },
  });

  const members = org?.members ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [professionalId, setProfessionalId] = useState("");
  const [referenceType, setReferenceType] = useState<"service" | "product">(
    "service",
  );
  const [referenceId, setReferenceId] = useState("");
  const [commissionType, setCommissionType] = useState<"fixed" | "percentage">(
    "percentage",
  );
  const [fixedValue, setFixedValue] = useState("");
  const [percentageValue, setPercentageValue] = useState("");

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.serviceOrder.listCommissionConfigs.queryKey(),
    });

  const upsertMutation = useMutation(
    trpc.serviceOrder.upsertCommissionConfig.mutationOptions({
      onSuccess: () => {
        invalidate();
        closeDialog();
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.serviceOrder.deleteCommissionConfig.mutationOptions({
      onSuccess: () => {
        invalidate();
        setDeleteId(null);
      },
    }),
  );

  function openCreate() {
    setProfessionalId("");
    setReferenceType("service");
    setReferenceId("");
    setCommissionType("percentage");
    setFixedValue("");
    setPercentageValue("");
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    upsertMutation.mutate({
      professionalId,
      referenceType,
      referenceId,
      commissionType,
      fixedValueInCents:
        commissionType === "fixed"
          ? Math.round(parseFloat(fixedValue) * 100)
          : undefined,
      percentageValue:
        commissionType === "percentage"
          ? Math.round(parseFloat(percentageValue) * 100)
          : undefined,
    });
  }

  const referenceOptions =
    referenceType === "service"
      ? (services ?? []).map((s) => ({ id: s.id, name: s.name }))
      : (products ?? []).map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comissões</h1>
          <p className="text-muted-foreground">
            Configure comissões por profissional, serviço ou produto
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Comissão
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !configs?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">Nenhuma comissão configurada</p>
          <Button variant="outline" className="mt-4" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar primeira comissão
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead className="w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.professionalName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {c.referenceType === "service" ? "Serviço" : "Produto"}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.referenceName}</TableCell>
                  <TableCell>
                    {c.commissionType === "fixed"
                      ? formatPrice(c.fixedValueInCents ?? 0)
                      : formatPercentage(c.percentageValue ?? 0)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(c.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
            <DialogTitle>Nova Comissão</DialogTitle>
            <DialogDescription>
              Configure a comissão de um profissional para um serviço ou produto.
              Se já existir, será atualizada.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select value={professionalId} onValueChange={setProfessionalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={referenceType}
                  onValueChange={(v) => {
                    setReferenceType(v as "service" | "product");
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
                <Select value={referenceId} onValueChange={setReferenceId}>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Comissão</Label>
                <Select
                  value={commissionType}
                  onValueChange={(v) =>
                    setCommissionType(v as "fixed" | "percentage")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Valor Fixo</SelectItem>
                    <SelectItem value="percentage">Percentual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {commissionType === "fixed" ? (
                  <>
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="0,00"
                      value={fixedValue}
                      onChange={(e) => setFixedValue(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Label>Percentual (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      max={100}
                      placeholder="10.00"
                      value={percentageValue}
                      onChange={(e) => setPercentageValue(e.target.value)}
                    />
                  </>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  upsertMutation.isPending ||
                  !professionalId ||
                  !referenceId
                }
              >
                {upsertMutation.isPending ? "Salvando..." : "Salvar"}
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
            <DialogTitle>Excluir comissão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta configuração de comissão?
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
