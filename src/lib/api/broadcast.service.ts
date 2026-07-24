import { BroadcastUpsertFormData } from "@/common/validations/broadcast.schema";
import { ENDPOINTS } from "@/constants/endpoints";
import { Broadcast, ISearchBroadcast, SearchResult } from "@/lib/types";
import { apiRequest } from "@/services/api.service";

/**
 * ===== Payloads =====
 */

export type CreateBroadcastPayload = BroadcastUpsertFormData;

export type UpdateBroadcastPayload = Partial<CreateBroadcastPayload>;

/**
 * ===== Service
 */

export const broadcastService = {
  async getById(id: string): Promise<Broadcast> {
    return apiRequest<Broadcast>(ENDPOINTS.broadcasts.getById(id));
  },

  async getByIdPublic(id: string): Promise<Broadcast> {
    return apiRequest<Broadcast>(ENDPOINTS.broadcasts.getByIdPublic(id));
  },

  async list(search: ISearchBroadcast): Promise<SearchResult<Broadcast[]>> {
    return apiRequest<SearchResult<Broadcast[]>>(ENDPOINTS.broadcasts.list, {
      method: "GET",
      params: {
        page: search.page,
        per_page: search.per_page,
        filter: search.filter,
      },
    });
  },

  async listPublic(search: ISearchBroadcast): Promise<SearchResult<Broadcast[]>> {
    return apiRequest<SearchResult<Broadcast[]>>(ENDPOINTS.broadcasts.listPublic, {
      method: "GET",
      params: {
        page: search.page,
        per_page: search.per_page,
        filter: search.filter,
      },
    });
  },

  async create(payload: CreateBroadcastPayload): Promise<Broadcast> {
    return apiRequest<Broadcast>(ENDPOINTS.broadcasts.create, {
      method: "POST",
      body: payload,
    });
  },

  async update(id: string, payload: UpdateBroadcastPayload): Promise<Broadcast> {
    return apiRequest<Broadcast>(ENDPOINTS.broadcasts.update(id), {
      method: "PUT",
      body: payload,
    });
  },

  async remove(id: string): Promise<void> {
    await apiRequest<void>(ENDPOINTS.broadcasts.delete(id), {
      method: "DELETE",
    });
  },
};
