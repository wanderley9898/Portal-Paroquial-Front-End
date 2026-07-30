import { AdminUser } from "@/lib/types";

export type LoginResponse = {
  access_token: string;
  data: AdminUser;
};

export type SearchResponse<T> = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  items: T;
};
