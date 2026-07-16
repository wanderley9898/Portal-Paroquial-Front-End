import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/use-auth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ROUTES } from "../../constants/routes";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(ROUTES.panel.adminDashboard, { replace: true });
    } catch {
      setLoginError("Credenciais inválidas. Verifique o e-mail e a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4 py-12">
      <div className="w-full max-w-md rounded border border-gold/30 bg-card p-8 shadow-sm">
        <div className="gold-divider mx-auto mb-6 w-16" />
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Portal</p>
          <h1 className="mt-1 font-serif text-3xl text-primary">Área administrativa</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre para gerenciar o conteúdo do portal paroquial.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-sans text-xs uppercase tracking-wider text-muted-foreground"
            >
              E-mail
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-sans text-xs uppercase tracking-wider text-muted-foreground"
            >
              Senha
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {loginError && (
            <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2">
              <p className="text-xs text-destructive">{loginError}</p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Acesso restrito à equipe paroquial
        </p>
      </div>
    </div>
  );
}
