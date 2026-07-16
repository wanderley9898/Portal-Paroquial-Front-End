import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminUserService,
  type CreateAdminUserPayload,
} from "../../lib/api/admin-user.service";
import { queryKeysAdminUser } from "../queries/admin-user.query";

export const useCreateAdminUserMutation = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminUserPayload) =>
      adminUserService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysAdminUser.list],
      });
    },
  });
};
