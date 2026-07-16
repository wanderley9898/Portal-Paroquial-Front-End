import { worldService } from "@/lib/api/world.service";
import { useQuery } from "@tanstack/react-query";

export const queryKeysWorld = {
  mine: "world:mine",
  listPublic: "world:list-public",
  byId: "world:by-id",
  mechanics: "world:mechanics",
} as const;

export const useWorldMineListQuery = () => {
  return useQuery({
    queryKey: [queryKeysWorld.mine],
    queryFn: () => worldService.listMine(),
    refetchOnWindowFocus: false,
  });
};

export const useWorldPublicListQuery = (per_page = 100) => {
  return useQuery({
    queryKey: [queryKeysWorld.listPublic, per_page],
    queryFn: () => worldService.listPublic(per_page),
    refetchOnWindowFocus: false,
  });
};

export const useWorldByIdQuery = (worldId: string) => {
  return useQuery({
    queryKey: [queryKeysWorld.byId, worldId],
    queryFn: () => worldService.getById(worldId),
    enabled: Boolean(worldId),
    refetchOnWindowFocus: false,
  });
};

export const useWorldMechanicsQuery = (worldId: string) => {
  return useQuery({
    queryKey: [queryKeysWorld.mechanics, worldId],
    queryFn: () => worldService.listMechanics(worldId),
    enabled: Boolean(worldId),
    refetchOnWindowFocus: false,
  });
};
