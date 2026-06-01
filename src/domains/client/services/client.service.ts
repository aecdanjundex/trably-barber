import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TRPCError } from "@trpc/server";
import { TYPES } from "@/lib/di/types";
import type { IClientRepository } from "../interfaces/client.repository.interface";
import type { IClientService } from "../interfaces/client.service.interface";
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
export class ClientService implements IClientService {
  constructor(
    @inject(TYPES.ClientRepository) private repo: IClientRepository,
  ) {}

  list(
    input: ListClientsInput,
  ): Promise<{ data: ClientWithTags[]; total: number }> {
    return this.repo.list(input);
  }

  async getById(id: string, organizationId: string): Promise<ClientDetail> {
    const result = await this.repo.findById(id, organizationId);
    if (!result) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Cliente não encontrado" });
    }
    return result;
  }

  create(input: CreateClientInput): Promise<Client> {
    return this.repo.create(input);
  }

  update(
    id: string,
    organizationId: string,
    input: UpdateClientInput,
  ): Promise<Client> {
    return this.repo.update(id, organizationId, input);
  }

  delete(id: string, organizationId: string): Promise<void> {
    return this.repo.delete(id, organizationId);
  }

  listTags(organizationId: string): Promise<ClientTag[]> {
    return this.repo.listTags(organizationId);
  }

  createTag(
    organizationId: string,
    name: string,
    color?: string,
  ): Promise<ClientTag> {
    return this.repo.createTag(organizationId, name, color);
  }

  deleteTag(id: string, organizationId: string): Promise<void> {
    return this.repo.deleteTag(id, organizationId);
  }

  addNote(input: CreateClientNoteInput): Promise<ClientNote> {
    return this.repo.addNote(input);
  }

  deleteNote(
    id: string,
    clientId: string,
    organizationId: string,
  ): Promise<void> {
    return this.repo.deleteNote(id, clientId, organizationId);
  }
}
