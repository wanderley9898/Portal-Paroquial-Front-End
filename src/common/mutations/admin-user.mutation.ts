import { queryKeysAdminUser } from "@/common/queries/admin-user.query";
import { adminUserService, type CreateAdminUserPayload } from "@/lib/api/admin-user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAdminUserMutation = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminUserPayload) => adminUserService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysAdminUser.list],
      });
    },
  });
};
