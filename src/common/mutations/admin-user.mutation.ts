import { queryKeysAdminUser } from "@/common/queries/admin-user.query";
import {
  adminUserService,
  type CreateAdminUserPayload,
  type UpdateAdminUserPayload,
} from "@/lib/api/admin-user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAdminUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminUserPayload) => adminUserService.create(payload),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [queryKeysAdminUser.list],
      });
    },
  });
};

export const useUpdateAdminUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminUserPayload }) =>
      adminUserService.update(id, payload),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [queryKeysAdminUser.list],
      });
    },
  });
};
