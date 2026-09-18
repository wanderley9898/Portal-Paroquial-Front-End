import { ParishEventUpsertFormData } from "@/common/validations/parish-event.schema";
import { ENDPOINTS } from "@/constants/endpoints";
import { ISearchParishEvent, ParishEvent, SearchResult } from "@/lib/types";
import { apiRequest } from "@/services/api.service";

/**
 * ===== Payloads =====
 */

export type CreateParishEventPayload = ParishEventUpsertFormData;

export type UpdateParishEventPayload = Partial<CreateParishEventPayload>;

function hasImageFile(payload: CreateParishEventPayload | UpdateParishEventPayload) {
  return payload.image instanceof File;
}

function toParishEventFormData(payload: CreateParishEventPayload | UpdateParishEventPayload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

/**
 * ===== Service
 */

export const parishEventService = {
  async getByIdPublic(id: string): Promise<ParishEvent> {
    return apiRequest<ParishEvent>(ENDPOINTS.parishEvents.getByIdPublic(id));
  },

  async listPublic(search: ISearchParishEvent): Promise<SearchResult<ParishEvent[]>> {
    return apiRequest<SearchResult<ParishEvent[]>>(ENDPOINTS.parishEvents.listPublic, {
      method: "GET",
      params: {
        page: search.page,
        per_page: search.per_page,
        filter: search.filter,
      },
    });
  },

  async getById(id: string): Promise<ParishEvent> {
    return apiRequest<ParishEvent>(ENDPOINTS.parishEvents.getById(id));
  },

  async list(search: ISearchParishEvent): Promise<SearchResult<ParishEvent[]>> {
    return apiRequest<SearchResult<ParishEvent[]>>(ENDPOINTS.parishEvents.list, {
      method: "GET",
      params: {
        page: search.page,
        per_page: search.per_page,
        filter: search.filter,
      },
    });
  },

  async create(payload: CreateParishEventPayload): Promise<ParishEvent> {
    return apiRequest<ParishEvent>(ENDPOINTS.parishEvents.create, {
      method: "POST",
      body: hasImageFile(payload) ? toParishEventFormData(payload) : payload,
    });
  },

  async update(id: string, payload: UpdateParishEventPayload): Promise<ParishEvent> {
    return apiRequest<ParishEvent>(ENDPOINTS.parishEvents.update(id), {
      method: "PUT",
      body: hasImageFile(payload) ? toParishEventFormData(payload) : payload,
    });
  },

  async remove(id: string): Promise<void> {
    await apiRequest<void>(ENDPOINTS.parishEvents.delete(id), {
      method: "DELETE",
    });
  },
};
