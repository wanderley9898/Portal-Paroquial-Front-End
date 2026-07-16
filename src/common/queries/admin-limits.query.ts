import {
  fetchUserLimits,
  fetchUsersWithLimits,
} from "@/lib/api/admin-limits.service";
import { useQuery } from "@tanstack/react-query";

export const ADMIN_USER_LIMITS_QUERY_KEY = "admin-user-limits";
export const ADMIN_USER_LIMIT_BY_ID_QUERY_KEY = "admin-user-limit-by-id";

export function useAdminUsersWithLimits(page = 1, per_page = 20) {
  return useQuery({
    queryKey: [ADMIN_USER_LIMITS_QUERY_KEY, page, per_page],
    queryFn: () => fetchUsersWithLimits(page, per_page),
  });
}

export function useAdminUserLimits(id: string) {
  return useQuery({
    queryKey: [ADMIN_USER_LIMIT_BY_ID_QUERY_KEY, id],
    queryFn: () => fetchUserLimits(id),
    enabled: !!id,
  });
}
