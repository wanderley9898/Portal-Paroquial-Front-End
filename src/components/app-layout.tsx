import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/use-auth";
import { ROUTES } from "../constants/routes";
import { AdminSidebar } from "./admin-sidebar";
import { SiteFooter, SiteHeader } from "./site-header";

export function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const showSidebar = Boolean(user) && location.pathname !== ROUTES.public.login;

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-screen overflow-hidden">
        {showSidebar && <AdminSidebar />}

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 shrink-0">
            <SiteHeader />
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto p-4 flex-1 h-full w-full ">
              <Outlet />
            </div>

            <SiteFooter />
          </main>
        </div>
      </div>
    </div>
  );
}
