import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../lib/api/auth.service";
import { clearSession, getStoredUser, getToken, saveSession } from "./session";
import type { AuthUser } from "./types";

type AuthContextType = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (payload: {
    name: string;
    email: string;
    password: string;
    acceptedLegal: boolean;
    legalVersion: string;
  }) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const persistAuth = useCallback((accessToken: string, authUser: AuthUser) => {
    saveSession(accessToken, authUser);
    setToken(accessToken);
    setUser(authUser);

    // Refresha dados do usuário após autenticação para garantir campos derivados.
    setTimeout(() => {
      authService
        .me()
        .then((updatedUser) => {
          saveSession(accessToken, updatedUser);
          setUser(updatedUser);
        })
        .catch(() => {
          // Continua com os dados já salvos se falhar.
        });
    }, 100);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return null;

    try {
      const updatedUser = await authService.me();
      setUser(updatedUser);
      if (token) {
        saveSession(token, updatedUser);
      }
      return updatedUser;
    } catch {
      return null;
    }
  }, [token]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authService.login({ email, password });

      persistAuth(response.access_token, response.data);

      return response.data;
    },
    [persistAuth],
  );

  const signup = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      acceptedLegal: boolean;
      legalVersion: string;
    }) => {
      const response = await authService.register(payload);

      persistAuth(response.access_token, response.data);

      return response.data;
    },
    [persistAuth],
  );

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      signup,
      logout,
      refreshUser,
    }),
    [token, user, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
