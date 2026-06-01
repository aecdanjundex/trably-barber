"use client";

import { use, useState } from "react";
import { ArrowLeft, Plus, Trash2, ClipboardList } from "lucide-react";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useForm } from "react-hook-form";

const STATUS_LABELS = {
  lead: { label: "Lead", variant: "outline" as const },
  active: { label: "Ativo", variant: "default" as const },
  inactive: { label: "Inativo", variant: "secondary" as const },
};

const NOTE_TYPE_LABELS: Record<string, string> = {
  note: "Nota",
  call: "Ligação",
  email: "Email",
  meeting: "Reunião",
  activity: "Atividade",
};

const ORDER_STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "Aberta", variant: "outline" },
  in_progress: { label: "Em andamento", variant: "default" },
  completed: { label: "Concluída", variant: "secondary" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const { data: client, isLoading } = useQuery(
    trpc.client.getById.queryOptions({ id }),
  );

  const { data: ordersData } = useQuery(
    trpc.serviceOrder.list.queryOptions({ clientId: id, pageSize: 20 }),
  );

  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState("note");

  const addNoteMutation = useMutation(
    trpc.client.addNote.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.client.getById.queryKey({ id }) });
        setNoteContent("");
      },
    }),
  );

  const deleteNoteMutation = useMutation(
    trpc.client.deleteNote.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.client.getById.queryKey({ id }) });
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-48 lg:col-span-1" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">Cliente não encontrado</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/admin/clientes">Voltar</Link>
        </Button>
      </div>
    );
  }

  const status = STATUS_LABELS[client.status as keyof typeof STATUS_LABELS];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/clientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <Badge variant={status?.variant ?? "outline"}>
              {status?.label ?? client.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Cliente desde{" "}
            {new Date(client.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client info */}
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {client.email && (
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              )}
              {client.phone && (
                <div>
                  <p className="text-muted-foreground">Telefone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              )}
              {client.document && (
                <div>
                  <p className="text-muted-foreground">Documento</p>
                  <p className="font-medium">{client.document}</p>
                </div>
              )}
              {(client.city || client.state) && (
                <div>
                  <p className="text-muted-foreground">Localização</p>
                  <p className="font-medium">
                    {[client.city, client.state].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
              {client.source && (
                <div>
                  <p className="text-muted-foreground">Origem</p>
                  <p className="font-medium">{client.source}</p>
                </div>
              )}
              {client.notes && (
                <div>
                  <p className="text-muted-foreground">Observações</p>
                  <p>{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de Ordens</span>
                <span className="font-medium">{client.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Gasto</span>
                <span className="font-medium">
                  {formatCurrency(client.totalSpentInCents)}
                </span>
              </div>
              {client.lastOrderAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última Ordem</span>
                  <span className="font-medium">
                    {new Date(client.lastOrderAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {client.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {client.tags.map((t) => (
                    <span
                      key={t.id}
                      className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: notes + orders */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Ordens de Serviço</CardTitle>
              <Button size="sm" asChild>
                <Link href={`/admin/ordens?clientId=${id}`}>
                  <ClipboardList className="mr-1 h-4 w-4" />
                  Ver ordens
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!ordersData?.data.length ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma ordem de serviço
                </p>
              ) : (
                <div className="space-y-2">
                  {ordersData.data.slice(0, 5).map((order) => {
                    const orderStatus =
                      ORDER_STATUS_LABELS[order.status] ?? {
                        label: order.status,
                        variant: "outline" as const,
                      };
                    return (
                      <Link
                        key={order.id}
                        href={`/admin/ordens/${order.id}`}
                        className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                      >
                        <span className="font-medium">OS #{order.number}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                          <Badge variant={orderStatus.variant}>
                            {orderStatus.label}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Histórico de Notas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add note */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Adicionar uma nota sobre este cliente…"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <select
                    className="rounded-md border bg-background px-2 py-1 text-sm"
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                  >
                    {Object.entries(NOTE_TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    disabled={!noteContent.trim() || addNoteMutation.isPending}
                    onClick={() => {
                      if (!noteContent.trim()) return;
                      addNoteMutation.mutate({
                        clientId: id,
                        content: noteContent.trim(),
                        type: noteType as "note" | "call" | "email" | "meeting" | "activity",
                      });
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Notes list */}
              {client.notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma nota registrada
                </p>
              ) : (
                <div className="space-y-3">
                  {client.notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg border p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {NOTE_TYPE_LABELS[note.type] ?? note.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {note.authorName} ·{" "}
                            {new Date(note.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            deleteNoteMutation.mutate({
                              id: note.id,
                              clientId: id,
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
