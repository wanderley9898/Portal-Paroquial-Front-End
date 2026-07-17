import type { NewsCategoryEnum, RolesEnum } from "@/utils/enums";

export { NewsCategoryEnum, NewsCategoryLabels, RolesEnum, RolesLabels } from "@/utils/enums";

export interface IBaseEntityWithUUID {
  id: string;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface Search<T> {
  filter?: T;
  page?: number;
  per_page?: number;
}

export interface SearchResult<T> {
  items: T;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Users
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: RolesEnum;
  createdAt: string;
}

// News
export interface News extends IBaseEntityWithUUID {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  category: NewsCategoryEnum;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  expiresAt?: string;
  youtubeUrl?: string;
  tags?: string[];
  views: number;
  authorName: string;
}

export interface ISearchNewsFilter {
  q?: string;

  category?: NewsCategoryEnum;

  featured?: boolean;

  published?: boolean;

  onlyVisible?: boolean;

  authorId?: string;

  publishedFrom?: string;

  publishedTo?: string;

  tag?: string;
}

export interface ISearchNews extends Search<ISearchNewsFilter> {}
