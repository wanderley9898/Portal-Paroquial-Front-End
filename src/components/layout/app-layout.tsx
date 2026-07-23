import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./admin-sidebar";
import { SiteFooter, SiteHeader } from "./site-header";

export function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b bg-background">
          <SiteHeader />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            <div className="flex-1 ">
              <Outlet />
            </div>

            <SiteFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
