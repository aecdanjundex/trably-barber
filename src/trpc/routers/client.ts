import { z } from "zod";
import { createTRPCRouter, orgProcedure, orgAdminProcedure } from "../init";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { IClientService } from "@/domains/client/interfaces/client.service.interface";

const clientService = () => container.get<IClientService>(TYPES.ClientService);

export const clientRouter = createTRPCRouter({
  list: orgProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(["lead", "active", "inactive"]).optional(),
        tagId: z.string().optional(),
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(20),
      }),
    )
    .query(({ ctx, input }) =>
      clientService().list({ organizationId: ctx.orgId, ...input }),
    ),

  getById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      clientService().getById(input.id, ctx.orgId),
    ),

  create: orgProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email().optional().nullable(),
        phone: z.string().optional().nullable(),
        document: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        state: z.string().optional().nullable(),
        status: z.enum(["lead", "active", "inactive"]).default("active"),
        source: z
          .enum(["referral", "social", "walk_in", "website", "other"])
          .optional()
          .nullable(),
        notes: z.string().optional().nullable(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      clientService().create({ organizationId: ctx.orgId, ...input }),
    ),

  update: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional().nullable(),
        phone: z.string().optional().nullable(),
        document: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        state: z.string().optional().nullable(),
        status: z.enum(["lead", "active", "inactive"]).optional(),
        source: z
          .enum(["referral", "social", "walk_in", "website", "other"])
          .optional()
          .nullable(),
        notes: z.string().optional().nullable(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return clientService().update(id, ctx.orgId, data);
    }),

  delete: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      clientService().delete(input.id, ctx.orgId),
    ),

  listTags: orgProcedure.query(({ ctx }) =>
    clientService().listTags(ctx.orgId),
  ),

  createTag: orgAdminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        color: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      clientService().createTag(ctx.orgId, input.name, input.color),
    ),

  deleteTag: orgAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      clientService().deleteTag(input.id, ctx.orgId),
    ),

  addNote: orgProcedure
    .input(
      z.object({
        clientId: z.string(),
        content: z.string().min(1),
        type: z
          .enum(["note", "call", "email", "meeting", "activity"])
          .default("note"),
      }),
    )
    .mutation(({ ctx, input }) =>
      clientService().addNote({
        ...input,
        organizationId: ctx.orgId,
        authorId: ctx.user.id,
      }),
    ),

  deleteNote: orgProcedure
    .input(z.object({ id: z.string(), clientId: z.string() }))
    .mutation(({ ctx, input }) =>
      clientService().deleteNote(input.id, input.clientId, ctx.orgId),
    ),
});
