import { parishEventService } from "@/lib/api/parish-events.service";
import { ISearchParishEvent } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const queryKeysParishEvent = {
  list: "parish-events:list",
  byId: "parish-events:by-id",
  listPublic: "parish-events:list-public",
  byIdPublic: "parish-events:by-id-public",
} as const;

export const useParishEventListQuery = (search: ISearchParishEvent) => {
  return useQuery({
    queryKey: [queryKeysParishEvent.list, search],
    queryFn: () => parishEventService.list(search),
    refetchOnWindowFocus: false,
  });
};

export const useParishEventPublicListQuery = (search: ISearchParishEvent) => {
  return useQuery({
    queryKey: [queryKeysParishEvent.listPublic, search],
    queryFn: () => parishEventService.listPublic(search),
    refetchOnWindowFocus: false,
  });
};

export const useParishEventByIdQuery = (
  id: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [queryKeysParishEvent.byId, id],
    queryFn: () => parishEventService.getById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

export const useParishEventByIdPublicQuery = (
  id: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [queryKeysParishEvent.byIdPublic, id],
    queryFn: () => parishEventService.getByIdPublic(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};
