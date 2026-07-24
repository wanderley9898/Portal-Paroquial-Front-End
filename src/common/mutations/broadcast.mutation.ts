import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeysBroadcast } from "@/common/queries/broadcast.query";
import {
  broadcastService,
  CreateBroadcastPayload,
  UpdateBroadcastPayload,
} from "@/lib/api/broadcast.service";

export const useCreateBroadcastMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBroadcastPayload) => broadcastService.create(payload),

    onSuccess: async () => {
      toast.success("Transmissão criada com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysBroadcast.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysBroadcast.listPublic],
      });
    },

    onError: () => {
      toast.error("Não foi possível criar a transmissão.");
    },
  });
};

export const useUpdateBroadcastMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBroadcastPayload }) =>
      broadcastService.update(id, payload),

    onSuccess: async (_, variables) => {
      toast.success("Transmissão atualizada com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysBroadcast.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysBroadcast.listPublic],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysBroadcast.byId, variables.id],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysBroadcast.byIdPublic, variables.id],
      });
    },

    onError: () => {
      toast.error("Não foi possível atualizar a transmissão.");
    },
  });
};

export const useDeleteBroadcastMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => broadcastService.remove(id),

    onSuccess: async () => {
      toast.success("Transmissão excluída com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysBroadcast.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysBroadcast.listPublic],
      });
    },

    onError: () => {
      toast.error("Não foi possível excluir a transmissão.");
    },
  });
};
