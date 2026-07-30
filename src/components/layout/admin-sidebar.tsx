import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Radio,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/use-auth";
import { ROUTES } from "../../constants/routes";
import { Button } from "../ui/button";

const adminNavItems = [
  {
    label: "Dashboard",
    to: ROUTES.panel.adminDashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Usuários",
    to: ROUTES.panel.users,
    icon: Users,
  },
  {
    label: "Notícias",
    to: ROUTES.panel.adminNews,
    icon: Newspaper,
  },
  {
    label: "Transmissões",
    to: ROUTES.panel.adminBroadcasts,
    icon: Radio,
  },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || location.pathname === ROUTES.public.login) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate(ROUTES.public.home, { replace: true });
  };

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 border-r bg-card transition-all duration-300 lg:flex lg:flex-col",
        collapsed ? "lg:w-16" : "lg:w-72",
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Portal</p>

            <h2 className="text-xl font-semibold">Painel paroquial</h2>
          </div>
        )}

        <Button size="icon" variant="ghost" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {adminNavItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2 transition-all",
                collapsed ? "justify-center" : "gap-3",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />

            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-2 pt-4 space-y-2">
        <NavLink
          to={ROUTES.panel.accountSettings}
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg",
              collapsed ? "justify-center" : "gap-3",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent",
            )
          }
        >
          <Settings className="h-5 w-5" />

          {!collapsed && "Configurações"}
        </NavLink>

        <Button
          variant="ghost"
          className={cn("w-full", collapsed ? "justify-center" : "justify-start gap-3")}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />

          {!collapsed && "Sair"}
        </Button>
      </div>
    </aside>
  );
}
