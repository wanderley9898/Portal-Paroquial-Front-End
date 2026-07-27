import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import type { UserRole } from "./types";
import { useAuth } from "./use-auth";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.public.home} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.public.home} replace />;
  }

  return <Outlet />;
}
