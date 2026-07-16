import {
  type CreateWorldMechanicPayload,
  type CreateWorldPayload,
  type UpdateWorldMechanicPayload,
  worldService,
} from "@/lib/api/world.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysWorld } from "../queries/world.query";

export const useCreateWorldMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorldPayload) => worldService.create(payload),
    onSuccess: async (world) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysWorld.mine],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysWorld.byId, world.id],
      });
    },
  });
};

export const useDeleteWorldMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (worldId: string) => worldService.remove(worldId),
    onSuccess: async (_, worldId) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysWorld.mine],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysWorld.byId, worldId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysWorld.mechanics, worldId],
      });
    },
  });
};

export const useCreateWorldMechanicMutation = (worldId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorldMechanicPayload) =>
      worldService.createMechanic(worldId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysWorld.mechanics, worldId],
      });
    },
  });
};

export const useDeleteWorldMechanicMutation = (worldId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mechanicId: string) =>
      worldService.removeMechanic(worldId, mechanicId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysWorld.mechanics, worldId],
      });
    },
  });
};

export const useUpdateWorldMechanicMutation = (worldId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mechanicId,
      payload,
    }: {
      mechanicId: string;
      payload: UpdateWorldMechanicPayload;
    }) => worldService.updateMechanic(worldId, mechanicId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysWorld.mechanics, worldId],
      });
    },
  });
};
