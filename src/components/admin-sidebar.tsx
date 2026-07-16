import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Radio,
  Settings,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/use-auth";
import { ROUTES } from "../constants/routes";

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
    label: "Eventos",
    to: ROUTES.panel.adminEvents,
    icon: CalendarDays,
  },
  {
    label: "Transmissões",
    to: ROUTES.panel.adminBroadcasts,
    icon: Radio,
  },
  {
    label: "Documentos",
    to: ROUTES.panel.adminDocuments,
    icon: FileText,
  },
];

export function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.public.home, { replace: true });
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border/60 bg-card/90 px-6 py-8 lg:flex">
      <div className="space-y-1">
        <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-gold">Portal</p>
        <h2 className="font-serif text-2xl text-primary">Painel paroquial</h2>
      </div>

      <nav className="mt-8 space-y-1">
        {adminNavItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-border/60 pt-6">
        <NavLink
          to={ROUTES.panel.accountSettings}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            ].join(" ")
          }
        >
          <Settings className="h-4 w-4" />
          <span>Configurações</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
