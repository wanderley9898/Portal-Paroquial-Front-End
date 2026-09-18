import {
  Book,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Radio,
  Settings,
  Users,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LOGO_URL, TITLE } from "@/constants/envs";

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const normalizedName = (user?.name ?? "").trim();
  const byWords = normalizedName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("");
  const compactName = normalizedName.replace(/\s+/g, "").toUpperCase();
  const userInitials = (byWords + compactName).slice(0, 2) || "US";

  const handleMobileNavigate = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate(ROUTES.public.home);
  };

  const handleOpenAccountSettings = () => {
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(ROUTES.panel.accountSettings);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-2">
        <Link to={ROUTES.public.home} className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt={TITLE}
            className="h-10 w-10 rounded-full border border-gold object-cover"
          />
          <span className="font-display text-xl tracking-wide text-gold">{TITLE}</span>
        </Link>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="ml-auto md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-background">
            <div className="mt-8 space-y-2 font-sans text-sm">
              {isAuthenticated && (
                <>
                  <p className="px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Painel Administrativo
                  </p>

                  <Link
                    to={ROUTES.panel.adminDashboard}
                    onClick={handleMobileNavigate}
                    className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <Link
                    to={ROUTES.panel.users}
                    onClick={handleMobileNavigate}
                    className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
                  >
                    <Users className="h-4 w-4" />
                    Usuários
                  </Link>

                  <Link
                    to={ROUTES.panel.adminNews}
                    onClick={handleMobileNavigate}
                    className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
                  >
                    <Newspaper className="h-4 w-4" />
                    Notícias
                  </Link>

                  <Link
                    to={ROUTES.panel.adminBroadcasts}
                    onClick={handleMobileNavigate}
                    className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
                  >
                    <Radio className="h-4 w-4" />
                    Transmissões
                  </Link>
                </>
              )}

              <div className="my-4 border-t border-border" />

              <p className="px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Área Pública
              </p>

              <Link
                to={ROUTES.public.news}
                onClick={handleMobileNavigate}
                className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
              >
                <Newspaper className="h-4 w-4" />
                Notícias
              </Link>

              <Link
                to={ROUTES.public.events}
                onClick={handleMobileNavigate}
                className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
              >
                <CalendarDays className="h-4 w-4" />
                Eventos
              </Link>

              <Link
                to={ROUTES.public.broadcasts}
                onClick={handleMobileNavigate}
                className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
              >
                <Radio className="h-4 w-4" />
                Transmissões
              </Link>

              <Link
                to={ROUTES.public.bible}
                onClick={handleMobileNavigate}
                className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
              >
                <Book className="h-4 w-4" />
                Bíblia
              </Link>

              <div className="mt-4 border-t border-border/60 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={handleOpenAccountSettings}
                      className="flex w-full items-center gap-2 rounded px-3 py-2 text-left hover:bg-card"
                    >
                      <Settings className="h-4 w-4" />
                      Configurações da conta
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded px-3 py-2 text-left hover:bg-card"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link to={ROUTES.public.login} className="block rounded px-3 py-2 hover:bg-card">
                    Entrar
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <nav className="ml-auto hidden items-center gap-2 font-sans text-sm text-muted-foreground md:flex">
          <Link
            to={ROUTES.public.news}
            className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
          >
            <Newspaper className="h-4 w-4" />
            Notícias
          </Link>
          <Link
            to={ROUTES.public.events}
            className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
          >
            <CalendarDays className="h-4 w-4" />
            Eventos
          </Link>
          <Link
            to={ROUTES.public.broadcasts}
            className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
          >
            <Radio className="h-4 w-4" />
            Transmissões
          </Link>
          <Link
            to={ROUTES.public.bible}
            className="flex items-center gap-2 rounded px-3 py-2 hover:bg-card"
          >
            <Book className="h-4 w-4" />
            Bíblia
          </Link>
        </nav>
        <div className="hidden md:flex md:items-center md:gap-3 md:relative">
          {isAuthenticated && user ? (
            <div
              onMouseEnter={() => setDesktopMenuOpen(true)}
              onMouseLeave={() => setDesktopMenuOpen(false)}
            >
              <Popover
                open={desktopMenuOpen}
                onOpenChange={(nextOpen) => {
                  if (nextOpen) setDesktopMenuOpen(true);
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded px-3 py-2 font-sans text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 bg-card text-[11px] font-semibold uppercase text-gold">
                      {userInitials || "US"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" side="bottom" sideOffset={0} className="w-56 p-0">
                  <div className="px-4 py-3 border-b border-border/60 space-y-1">
                    <p className="font-sans text-xs uppercase tracking-wider text-gold break-all">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAccountSettings}
                    className="flex w-full items-center gap-2 px-4 py-2 font-sans text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações da conta
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 font-sans text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Link to={ROUTES.public.login}>
              <Button
                variant="outline"
                size="sm"
                className="border-gold/40 font-sans uppercase tracking-wider text-gold hover:bg-gold hover:text-primary-foreground"
              >
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-2 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt={TITLE}
            className="h-9 w-9 rounded-full border border-gold object-cover"
          />

          <span className="font-display text-base text-gold">{TITLE}</span>
        </div>

        <nav className="md:ml-auto">
          <ul className="flex flex-wrap items-end justify-end gap-5 text-sm text-muted-foreground md:justify-end">
            <li>
              <Link to={ROUTES.public.news} className="hover:text-foreground">
                Notícias
              </Link>
            </li>

            <li>
              <Link to={ROUTES.public.broadcasts} className="hover:text-foreground">
                Transmissões
              </Link>
            </li>

            <li>
              <Link to={ROUTES.public.bible} className="hover:text-foreground">
                Bíblia
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/60 py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Portal Paroquial · Todos os direitos reservados
      </div>
    </footer>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-border/60 bg-parchment", className)}>
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <div className="gold-divider mx-auto mb-4 w-20" />
        {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>}
        <h1 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto max-w-6xl px-4 py-12", className)}>{children}</div>;
}
