import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeysNews } from "@/common/queries/news.query";
import { CreateNewsPayload, newsService, UpdateNewsPayload } from "@/lib/api/news.service";

export const useCreateNewsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNewsPayload) => newsService.create(payload),

    onSuccess: async () => {
      toast.success("Notícia criada com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysNews.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysNews.listPublic],
      });
    },

    onError: () => {
      toast.error("Não foi possível criar a notícia.");
    },
  });
};

export const useUpdateNewsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNewsPayload }) =>
      newsService.update(id, payload),

    onSuccess: async (_, variables) => {
      toast.success("Notícia atualizada com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysNews.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysNews.listPublic],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysNews.byId, variables.id],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysNews.byIdPublic, variables.id],
      });
    },

    onError: () => {
      toast.error("Não foi possível atualizar a notícia.");
    },
  });
};

export const useDeleteNewsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => newsService.remove(id),

    onSuccess: async () => {
      toast.success("Notícia excluída com sucesso!");

      await queryClient.refetchQueries({
        queryKey: [queryKeysNews.list],
      });

      await queryClient.refetchQueries({
        queryKey: [queryKeysNews.listPublic],
      });
    },

    onError: () => {
      toast.error("Não foi possível excluir a notícia.");
    },
  });
};
