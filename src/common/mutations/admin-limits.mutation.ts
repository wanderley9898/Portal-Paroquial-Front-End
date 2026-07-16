import { ADMIN_USER_LIMITS_QUERY_KEY } from "@/common/queries/admin-limits.query";
import {
  updateUserLimits,
  type UpdateUserLimitsPayload,
} from "@/lib/api/admin-limits.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserLimits(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserLimitsPayload) =>
      updateUserLimits(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_USER_LIMITS_QUERY_KEY],
      });
    },
  });
}
