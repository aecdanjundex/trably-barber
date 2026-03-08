"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ROLE_LABELS: Record<string, string> = {
  owner: "Dono",
  admin: "Admin",
  barber: "Barbeiro",
};

type InviteFormData = {
  email: string;
  role: string;
};

export default function EquipePage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const form = useForm<InviteFormData>({
    defaultValues: { email: "", role: "barber" },
  });

  const { data: members = [], isLoading } = useQuery(
    trpc.admin.listOrgMembers.queryOptions(),
  );

  const inviteMutation = useMutation({
    mutationFn: async (data: InviteFormData) => {
      const result = await authClient.organization.inviteMember({
        email: data.email,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: data.role as any,
      });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.listOrgMembers.queryKey(),
      });
      setInviteOpen(false);
      form.reset();
    },
  });

  const toggleBanMutation = useMutation(
    trpc.admin.toggleUserBan.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.listOrgMembers.queryKey(),
        });
      },
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua barbearia
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Convidar
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !members.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">Nenhum membro encontrado</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Ativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={m.userImage ?? undefined} />
                        <AvatarFallback>
                          {m.userName?.[0]?.toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{m.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.userEmail}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={m.role === "owner" ? "default" : "secondary"}
                    >
                      {ROLE_LABELS[m.role] ?? m.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {m.role !== "owner" ? (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!m.banned}
                          onCheckedChange={(val) =>
                            toggleBanMutation.mutate({
                              userId: m.userId,
                              banned: !val,
                            })
                          }
                          disabled={toggleBanMutation.isPending}
                        />
                        <span className="text-sm text-muted-foreground">
                          {m.banned ? "Inativo" : "Ativo"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar membro</DialogTitle>
            <DialogDescription>
              Envie um convite por email para adicionar um membro à sua equipe
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((data) => inviteMutation.mutate(data))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="barbeiro@email.com"
                {...form.register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select
                value={form.watch("role")}
                onValueChange={(val) => val && form.setValue("role", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="barber">Barbeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {inviteMutation.error && (
              <p className="text-sm text-destructive">
                {inviteMutation.error.message}
              </p>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setInviteOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={inviteMutation.isPending}>
                {inviteMutation.isPending ? "Enviando..." : "Enviar convite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
