import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./admin-sidebar";
import { SiteFooter, SiteHeader } from "./site-header";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-border/70 bg-background/95">
          <SiteHeader />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            <div className="min-w-0 flex-1">
              <Outlet />
            </div>

            <SiteFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
