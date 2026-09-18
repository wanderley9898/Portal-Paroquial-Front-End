import { NewsUpsertFormData } from "@/common/validations/news.schema";
import { ENDPOINTS } from "@/constants/endpoints";
import { ISearchNews, News, SearchResult } from "@/lib/types";
import { apiRequest } from "@/services/api.service";

/**
 * ===== Payloads =====
 */

export type CreateNewsPayload = NewsUpsertFormData;

export type UpdateNewsPayload = Partial<CreateNewsPayload>;

function hasImageFile(payload: CreateNewsPayload | UpdateNewsPayload) {
  return payload.coverImage instanceof File || payload.thumbnail instanceof File;
}

function toNewsFormData(payload: CreateNewsPayload | UpdateNewsPayload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
  });

  return formData;
}

/**
 * ===== Service
 */

export const newsService = {
  async getById(id: string): Promise<News> {
    return apiRequest<News>(ENDPOINTS.news.getById(id));
  },

  async getByIdPublic(id: string): Promise<News> {
    return apiRequest<News>(ENDPOINTS.news.getByIdPublic(id));
  },

  async list(search: ISearchNews): Promise<SearchResult<News[]>> {
    return apiRequest<SearchResult<News[]>>(ENDPOINTS.news.list, {
      method: "GET",
      params: {
        page: search.page,
        per_page: search.per_page,
        filter: search.filter,
      },
    });
  },

  async listPublic(search: ISearchNews): Promise<SearchResult<News[]>> {
    return apiRequest<SearchResult<News[]>>(ENDPOINTS.news.listPublic, {
      method: "GET",
      params: {
        page: search.page,
        per_page: search.per_page,
        filter: search.filter,
      },
    });
  },

  async create(payload: CreateNewsPayload): Promise<News> {
    return apiRequest<News>(ENDPOINTS.news.create, {
      method: "POST",
      body: hasImageFile(payload) ? toNewsFormData(payload) : payload,
    });
  },

  async update(id: string, payload: UpdateNewsPayload): Promise<News> {
    return apiRequest<News>(ENDPOINTS.news.update(id), {
      method: "PUT",
      body: hasImageFile(payload) ? toNewsFormData(payload) : payload,
    });
  },

  async remove(id: string): Promise<void> {
    await apiRequest<void>(ENDPOINTS.news.delete(id), {
      method: "DELETE",
    });
  },
};
