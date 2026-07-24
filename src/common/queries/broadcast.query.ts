import { useQuery } from "@tanstack/react-query";

import { broadcastService } from "@/lib/api/broadcast.service";
import { ISearchBroadcast } from "@/lib/types";

export const queryKeysBroadcast = {
  list: "broadcast:list",
  listPublic: "broadcast:list-public",
  byId: "broadcast:by-id",
  byIdPublic: "broadcast:by-id-public",
} as const;

export const useBroadcastListQuery = (search: ISearchBroadcast) => {
  return useQuery({
    queryKey: [queryKeysBroadcast.list, search],
    queryFn: () => broadcastService.list(search),
    refetchOnWindowFocus: false,
  });
};

export const useBroadcastPublicListQuery = (search: ISearchBroadcast) => {
  return useQuery({
    queryKey: [queryKeysBroadcast.listPublic, search],
    queryFn: () => broadcastService.listPublic(search),
    refetchOnWindowFocus: false,
  });
};

export const useBroadcastByIdQuery = (
  id: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [queryKeysBroadcast.byId, id],
    queryFn: () => broadcastService.getById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

export const useBroadcastByIdPublicQuery = (
  id: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [queryKeysBroadcast.byIdPublic, id],
    queryFn: () => broadcastService.getByIdPublic(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};
