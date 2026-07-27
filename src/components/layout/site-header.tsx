import { Check, Copy, LogOut, Menu, Settings } from "lucide-react";
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
  const [copiedCode, setCopiedCode] = useState(false);

  const normalizedName = (user?.name ?? "").trim();
  const byWords = normalizedName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const compactName = normalizedName.replace(/\s+/g, "").toUpperCase();
  const userInitials = (byWords + compactName).slice(0, 2) || "US";

  const handleCopyPlayerCode = async () => {
    const code = user?.playerCode;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleLogout = () => {
    setDesktopMenuOpen(false);
    logout();
    navigate(ROUTES.public.home);
  };

  const handleOpenAccountSettings = () => {
    setDesktopMenuOpen(false);
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

        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="ml-auto md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-background">
            <div className="mt-8 space-y-2 font-sans text-sm">
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

        <nav className="ml-auto hidden items-center gap-6 font-sans text-sm text-muted-foreground md:flex">
          {isAuthenticated && (
            <>
              <Link to={ROUTES.panel.users} className="hover:text-foreground">
                Usuários
              </Link>
            </>
          )}
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
                    {user?.playerCode && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center gap-1 min-w-0 font-sans text-xs font-semibold uppercase tracking-wider text-gold/80">
                          <span className="shrink-0">Cod:</span>

                          <span className="truncate text-gold">{user.playerCode}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyPlayerCode}
                          aria-label={copiedCode ? "Código copiado" : "Copiar código do jogador"}
                          title={copiedCode ? "Código copiado" : "Copiar código do jogador"}
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-gold/25 text-gold transition-colors hover:border-gold/50 hover:bg-gold/5"
                        >
                          {copiedCode ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    )}
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
    <footer className=" border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-4 md:flex-row">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt={TITLE}
            className="h-9 w-9 rounded-full border border-gold object-cover"
          />

          <span className="font-display text-base text-gold">{TITLE}</span>
        </div>

        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
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
              <Link to={ROUTES.public.radio} className="hover:text-foreground">
                Rádio
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
