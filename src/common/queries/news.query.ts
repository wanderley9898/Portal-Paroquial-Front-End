import { useQuery } from "@tanstack/react-query";

import { newsService } from "@/lib/api/news.service";
import { ISearchNews } from "@/lib/types";

export const queryKeysNews = {
  list: "news:list",
  listPublic: "news:list-public",
  byId: "news:by-id",
  byIdPublic: "news:by-id-public",
} as const;

export const useNewsListQuery = (search: ISearchNews) => {
  return useQuery({
    queryKey: [queryKeysNews.list, search],
    queryFn: () => newsService.list(search),
    refetchOnWindowFocus: false,
  });
};

export const useNewsPublicListQuery = (search: ISearchNews) => {
  return useQuery({
    queryKey: [queryKeysNews.listPublic, search],
    queryFn: () => newsService.listPublic(search),
    refetchOnWindowFocus: false,
  });
};

export const useNewsByIdQuery = (
  id: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [queryKeysNews.byId, id],
    queryFn: () => newsService.getById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

export const useNewsByIdPublicQuery = (
  id: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [queryKeysNews.byIdPublic, id],
    queryFn: () => newsService.getByIdPublic(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};
