"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, UserPlus } from "lucide-react";
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
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const form = useForm<InviteFormData>({
    defaultValues: { email: "", role: "barber" },
  });

  const { data: membersData, isLoading } = useQuery({
    queryKey: ["org-members"],
    queryFn: async () => {
      const result = await authClient.organization.getFullOrganization();
      return result.data;
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ["org-members"] });
      setInviteOpen(false);
      form.reset();
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const result = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
      });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-members"] });
      setRemoveId(null);
    },
  });

  const members = membersData?.members ?? [];

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
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={m.user.image ?? undefined} />
                        <AvatarFallback>
                          {m.user.name?.[0]?.toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{m.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={m.role === "owner" ? "default" : "secondary"}
                    >
                      {ROLE_LABELS[m.role] ?? m.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {m.role !== "owner" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRemoveId(m.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

      {/* Remove Confirmation */}
      <Dialog
        open={!!removeId}
        onOpenChange={(open) => !open && setRemoveId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover membro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este membro da equipe?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={removeMutation.isPending}
              onClick={() => removeId && removeMutation.mutate(removeId)}
            >
              {removeMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
