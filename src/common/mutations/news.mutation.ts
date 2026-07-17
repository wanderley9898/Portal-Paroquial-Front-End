import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeysNews } from "@/common/queries/news.query";
import { CreateNewsPayload, newsService, UpdateNewsPayload } from "@/lib/api/news.service";

export const useCreateNewsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNewsPayload) => newsService.create(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysNews.list],
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeysNews.listPublic],
      });
    },
  });
};

export const useUpdateNewsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNewsPayload }) =>
      newsService.update(id, payload),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysNews.list],
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeysNews.listPublic],
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeysNews.byId, variables.id],
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeysNews.byIdPublic, variables.id],
      });
    },
  });
};

export const useDeleteNewsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => newsService.remove(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysNews.list],
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeysNews.listPublic],
      });
    },
  });
};
