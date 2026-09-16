import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { queryKeysParishEvent } from "@/common/queries/parish-event.query";
import {
  CreateParishEventPayload,
  parishEventService,
  UpdateParishEventPayload,
} from "@/lib/api/parish-events.service";

export const useCreateParishEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateParishEventPayload) => parishEventService.create(payload),

    onSuccess: async () => {
      toast.success("Evento criado com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysParishEvent.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysParishEvent.listPublic],
      });
    },

    onError: () => {
      toast.error("Não foi possível criar o evento.");
    },
  });
};

export const useUpdateParishEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateParishEventPayload }) =>
      parishEventService.update(id, payload),

    onSuccess: async (_, variables) => {
      toast.success("Evento atualizado com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysParishEvent.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysParishEvent.listPublic],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysParishEvent.byId, variables.id],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysParishEvent.byIdPublic, variables.id],
      });
    },

    onError: () => {
      toast.error("Não foi possível atualizar o evento.");
    },
  });
};

export const useDeleteParishEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => parishEventService.remove(id),

    onSuccess: async () => {
      toast.success("Evento excluído com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysParishEvent.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysParishEvent.listPublic],
      });
    },

    onError: () => {
      toast.error("Não foi possível excluir o evento.");
    },
  });
};
