import type { SearchResponse } from "../../auth/types";
import { ENDPOINTS } from "../../constants/endpoints";
import { apiRequest } from "../../services/api.service";
import { AdminUser } from "../types";

export type AdminUserType = AdminUser;

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

export type UpdateAdminUserPayload = Omit<CreateAdminUserPayload, "password"> & {
  password?: string;
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

  update: (id: string, payload: UpdateAdminUserPayload) =>
    apiRequest<AdminUserType>(ENDPOINTS.adminUsers.byId(id), {
      method: "PUT",
      body: payload,
    }),

  getById: (id: string) => apiRequest<AdminUserType>(ENDPOINTS.adminUsers.byId(id)),
};
