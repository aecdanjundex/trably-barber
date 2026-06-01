import "reflect-metadata";
import { injectable, inject } from "inversify";
import { eq, and, ilike, or, sql, inArray } from "drizzle-orm";
import { TYPES } from "@/lib/di/types";
import type { Database } from "@/lib/db";
import {
  client,
  clientTag,
  clientTagAssignment,
  clientNote,
  serviceOrder,
  serviceOrderItem,
  serviceOrderPayment,
  user,
} from "@/db/schema";
import type { IClientRepository } from "../interfaces/client.repository.interface";
import type {
  Client,
  ClientTag,
  ClientNote,
  ClientWithTags,
  ClientDetail,
  CreateClientInput,
  UpdateClientInput,
  ListClientsInput,
  CreateClientNoteInput,
} from "../types";

@injectable()
export class ClientRepository implements IClientRepository {
  constructor(@inject(TYPES.Database) private db: Database) {}

  async list(
    input: ListClientsInput,
  ): Promise<{ data: ClientWithTags[]; total: number }> {
    const {
      organizationId,
      search,
      status,
      tagId,
      page = 1,
      pageSize = 20,
    } = input;

    const conditions = [eq(client.organizationId, organizationId)];

    if (status) conditions.push(eq(client.status, status));
    if (search) {
      conditions.push(
        or(
          ilike(client.name, `%${search}%`),
          ilike(client.email, `%${search}%`),
          ilike(client.phone, `%${search}%`),
        )!,
      );
    }

    let clientIds: string[] | undefined;
    if (tagId) {
      const assignments = await this.db
        .select({ clientId: clientTagAssignment.clientId })
        .from(clientTagAssignment)
        .where(eq(clientTagAssignment.tagId, tagId));
      clientIds = assignments.map((a) => a.clientId);
      if (clientIds.length === 0) return { data: [], total: 0 };
      conditions.push(inArray(client.id, clientIds));
    }

    const [clients, countResult] = await Promise.all([
      this.db
        .select()
        .from(client)
        .where(and(...conditions))
        .orderBy(client.name)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(client)
        .where(and(...conditions)),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    if (clients.length === 0) return { data: [], total };

    const ids = clients.map((c) => c.id);
    const assignments = await this.db
      .select({ clientId: clientTagAssignment.clientId, tag: clientTag })
      .from(clientTagAssignment)
      .innerJoin(clientTag, eq(clientTagAssignment.tagId, clientTag.id))
      .where(inArray(clientTagAssignment.clientId, ids));

    const tagsByClientId = new Map<string, ClientTag[]>();
    for (const a of assignments) {
      const existing = tagsByClientId.get(a.clientId) ?? [];
      existing.push(a.tag);
      tagsByClientId.set(a.clientId, existing);
    }

    return {
      data: clients.map((c) => ({
        ...c,
        tags: tagsByClientId.get(c.id) ?? [],
      })),
      total,
    };
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<ClientDetail | null> {
    const rows = await this.db
      .select()
      .from(client)
      .where(and(eq(client.id, id), eq(client.organizationId, organizationId)))
      .limit(1);

    if (!rows[0]) return null;
    const c = rows[0];

    const [tags, notes, orderStats] = await Promise.all([
      this.db
        .select({ tag: clientTag })
        .from(clientTagAssignment)
        .innerJoin(clientTag, eq(clientTagAssignment.tagId, clientTag.id))
        .where(eq(clientTagAssignment.clientId, id)),

      this.db
        .select({
          note: clientNote,
          authorName: user.name,
        })
        .from(clientNote)
        .innerJoin(user, eq(clientNote.authorId, user.id))
        .where(eq(clientNote.clientId, id))
        .orderBy(sql`${clientNote.createdAt} DESC`),

      this.db
        .select({
          total: sql<number>`count(${serviceOrder.id})`,
          spent: sql<number>`coalesce(sum(${serviceOrderPayment.amountInCents}),0)`,
          lastOrder: sql<Date | null>`max(${serviceOrder.createdAt})`,
        })
        .from(serviceOrder)
        .leftJoin(
          serviceOrderPayment,
          eq(serviceOrderPayment.serviceOrderId, serviceOrder.id),
        )
        .where(
          and(
            eq(serviceOrder.clientId, id),
            eq(serviceOrder.organizationId, organizationId),
          ),
        ),
    ]);

    return {
      ...c,
      tags: tags.map((t) => t.tag),
      notes: notes.map((n) => ({ ...n.note, authorName: n.authorName })),
      totalOrders: Number(orderStats[0]?.total ?? 0),
      totalSpentInCents: Number(orderStats[0]?.spent ?? 0),
      lastOrderAt: orderStats[0]?.lastOrder ?? null,
    };
  }

  async create(input: CreateClientInput): Promise<Client> {
    const { tagIds, ...data } = input;
    const id = crypto.randomUUID();
    const now = new Date();

    const [created] = await this.db
      .insert(client)
      .values({ id, ...data, createdAt: now, updatedAt: now })
      .returning();

    if (tagIds?.length) {
      await this.db.insert(clientTagAssignment).values(
        tagIds.map((tagId) => ({
          id: crypto.randomUUID(),
          clientId: id,
          tagId,
          createdAt: now,
        })),
      );
    }

    return created;
  }

  async update(
    id: string,
    organizationId: string,
    input: UpdateClientInput,
  ): Promise<Client> {
    const { tagIds, ...data } = input;
    const now = new Date();

    const [updated] = await this.db
      .update(client)
      .set({ ...data, updatedAt: now })
      .where(and(eq(client.id, id), eq(client.organizationId, organizationId)))
      .returning();

    if (tagIds !== undefined) {
      await this.db
        .delete(clientTagAssignment)
        .where(eq(clientTagAssignment.clientId, id));

      if (tagIds.length > 0) {
        await this.db.insert(clientTagAssignment).values(
          tagIds.map((tagId) => ({
            id: crypto.randomUUID(),
            clientId: id,
            tagId,
            createdAt: now,
          })),
        );
      }
    }

    return updated;
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.db
      .delete(client)
      .where(and(eq(client.id, id), eq(client.organizationId, organizationId)));
  }

  async listTags(organizationId: string): Promise<ClientTag[]> {
    return this.db
      .select()
      .from(clientTag)
      .where(eq(clientTag.organizationId, organizationId))
      .orderBy(clientTag.name);
  }

  async createTag(
    organizationId: string,
    name: string,
    color = "#6366f1",
  ): Promise<ClientTag> {
    const [created] = await this.db
      .insert(clientTag)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        name,
        color,
        createdAt: new Date(),
      })
      .returning();
    return created;
  }

  async deleteTag(id: string, organizationId: string): Promise<void> {
    await this.db
      .delete(clientTag)
      .where(
        and(eq(clientTag.id, id), eq(clientTag.organizationId, organizationId)),
      );
  }

  async addNote(input: CreateClientNoteInput): Promise<ClientNote> {
    const [created] = await this.db
      .insert(clientNote)
      .values({
        id: crypto.randomUUID(),
        ...input,
        type: input.type ?? "note",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return created;
  }

  async deleteNote(
    id: string,
    clientId: string,
    organizationId: string,
  ): Promise<void> {
    await this.db
      .delete(clientNote)
      .where(
        and(
          eq(clientNote.id, id),
          eq(clientNote.clientId, clientId),
          eq(clientNote.organizationId, organizationId),
        ),
      );
  }
}
