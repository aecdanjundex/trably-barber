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

export interface IClientRepository {
  list(
    input: ListClientsInput,
  ): Promise<{ data: ClientWithTags[]; total: number }>;
  findById(id: string, organizationId: string): Promise<ClientDetail | null>;
  create(input: CreateClientInput): Promise<Client>;
  update(
    id: string,
    organizationId: string,
    input: UpdateClientInput,
  ): Promise<Client>;
  delete(id: string, organizationId: string): Promise<void>;

  listTags(organizationId: string): Promise<ClientTag[]>;
  createTag(
    organizationId: string,
    name: string,
    color?: string,
  ): Promise<ClientTag>;
  deleteTag(id: string, organizationId: string): Promise<void>;

  addNote(input: CreateClientNoteInput): Promise<ClientNote>;
  deleteNote(
    id: string,
    clientId: string,
    organizationId: string,
  ): Promise<void>;
}
