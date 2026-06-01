export type ClientStatus = "lead" | "active" | "inactive";
export type ClientSource =
  | "referral"
  | "social"
  | "walk_in"
  | "website"
  | "other";
export type ClientNoteType = "note" | "call" | "email" | "meeting" | "activity";

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  status: ClientStatus;
  source: ClientSource | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientTag {
  id: string;
  organizationId: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface ClientTagAssignment {
  id: string;
  clientId: string;
  tagId: string;
  createdAt: Date;
}

export interface ClientNote {
  id: string;
  clientId: string;
  organizationId: string;
  authorId: string;
  content: string;
  type: ClientNoteType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientWithTags extends Client {
  tags: ClientTag[];
}

export interface ClientDetail extends ClientWithTags {
  notes: (ClientNote & { authorName: string })[];
  totalOrders: number;
  totalSpentInCents: number;
  lastOrderAt: Date | null;
}

export interface CreateClientInput {
  organizationId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  status?: ClientStatus;
  source?: ClientSource | null;
  notes?: string | null;
  tagIds?: string[];
}

export interface UpdateClientInput {
  name?: string;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  status?: ClientStatus;
  source?: ClientSource | null;
  notes?: string | null;
  tagIds?: string[];
}

export interface ListClientsInput {
  organizationId: string;
  search?: string;
  status?: ClientStatus;
  tagId?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateClientNoteInput {
  clientId: string;
  organizationId: string;
  authorId: string;
  content: string;
  type?: ClientNoteType;
}
