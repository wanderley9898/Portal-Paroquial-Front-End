import type { SearchResponse } from "../../auth/types";
import { ENDPOINTS } from "../../constants/endpoints";
import { apiRequest } from "../../services/api.service";

export type AdminUserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export type AdminUserSearchType = {
  page?: number;
  per_page?: number;
};

export type CreateAdminUserPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
};

export const adminUserService = {
  list: ({ page = 1, per_page = 10 }: AdminUserSearchType) =>
    apiRequest<SearchResponse<AdminUserType[]>>(
      `${ENDPOINTS.adminUsers.list}?page=${page}&per_page=${per_page}`,
    ),

  create: (payload: CreateAdminUserPayload) =>
    apiRequest<AdminUserType>(ENDPOINTS.adminUsers.list, {
      method: "POST",
      body: payload,
    }),
};
