import { NewsUpsertFormData } from "@/common/validations/news.schema";
import { ENDPOINTS } from "@/constants/endpoints";
import { ISearchNews, News, SearchResult } from "@/lib/types";
import { apiRequest } from "@/services/api.service";

/**
 * ===== Payloads =====
 */

export type CreateNewsPayload = NewsUpsertFormData;

export type UpdateNewsPayload = Partial<CreateNewsPayload>;

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
      body: payload,
    });
  },

  async update(id: string, payload: UpdateNewsPayload): Promise<News> {
    return apiRequest<News>(ENDPOINTS.news.update(id), {
      method: "PUT",
      body: payload,
    });
  },

  async remove(id: string): Promise<void> {
    await apiRequest<void>(ENDPOINTS.news.delete(id), {
      method: "DELETE",
    });
  },
};
