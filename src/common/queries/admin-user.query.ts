import { useQuery } from "@tanstack/react-query";
import {
  adminUserService,
  type AdminUserSearchType,
} from "../../lib/api/admin-user.service";

export const queryKeysAdminUser = {
  list: "admin-user:list",
} as const;

export const useAdminUserListQuery = (params: AdminUserSearchType) => {
  return useQuery({
    queryKey: [queryKeysAdminUser.list, params],
    queryFn: () =>
      adminUserService.list({
        page: params.page,
        per_page: params.per_page,
      }),

    refetchOnWindowFocus: false,
  });
};
