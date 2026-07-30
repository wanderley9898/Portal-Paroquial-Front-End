import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { createBrowserRouter, Link, useNavigate, useRouteError } from "react-router-dom";
import { ProtectedRoute } from "./auth/protected-route";
import { AppLayout } from "./components/layout/app-layout";
import { ROUTES } from "./constants/routes";

const PublicHomePage = lazy(() =>
  import("./pages/public-home").then((module) => ({
    default: module.PublicHomePage,
  })),
);
const LoginPage = lazy(() =>
  import("./pages/login").then((module) => ({
    default: module.LoginPage,
  })),
);

const AdminUsersPage = lazy(() =>
  import("./pages/admin/users/index").then((module) => ({
    default: module.default,
  })),
);
const AdminNewsPage = lazy(() =>
  import("./pages/admin/news/news").then((module) => ({
    default: module.default,
  })),
);

const AdminBroadcastsPage = lazy(() =>
  import("./pages/admin/broadcasts").then((module) => ({
    default: module.default,
  })),
);
const AccountSettingsPage = lazy(() =>
  import("./pages/account-settings").then((module) => ({
    default: module.AccountSettingsPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/news/news").then((module) => ({
    default: module.default,
  })),
);
const NewsPage = lazy(() =>
  import("./pages/news").then((module) => ({
    default: module.default,
  })),
);
const NewsDetailPage = lazy(() =>
  import("./pages/news/view").then((module) => ({
    default: module.default,
  })),
);

const BroadcastsPage = lazy(() =>
  import("./pages/broadcasts").then((module) => ({
    default: module.default,
  })),
);

function RouteFallback() {
  return (
    <div className="mx-auto flex min-h-[36vh] w-full max-w-3xl items-center justify-center px-4">
      <p className="font-ui text-sm tracking-wide text-quill">Carregando página...</p>
    </div>
  );
}

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{node}</Suspense>;
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 h-px w-24 bg-primary/60" />
        <h1 className="font-serif text-7xl text-primary">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-foreground">Página não encontrada</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded border border-primary/30 bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-foreground">Não foi possível carregar</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded border border-primary/30 bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="inline-flex items-center justify-center rounded border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-accent"
          >
            Ir ao início
          </button>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: ROUTES.public.home,
        element: withSuspense(<PublicHomePage />),
      },
      {
        path: ROUTES.public.login,
        element: withSuspense(<LoginPage />),
      },
      {
        path: ROUTES.public.about,
        element: withSuspense(<PublicHomePage />),
      },
      {
        path: ROUTES.public.news,
        element: withSuspense(<NewsPage />),
      },
      {
        path: ROUTES.public.newsDetailPattern,
        element: withSuspense(<NewsDetailPage />),
      },
      {
        path: ROUTES.public.events,
        element: withSuspense(<PublicHomePage />),
      },
      {
        path: ROUTES.public.eventsDetailPattern,
        element: withSuspense(<PublicHomePage />),
      },
      {
        path: ROUTES.public.broadcasts,
        element: withSuspense(<BroadcastsPage />),
      },
      {
        path: ROUTES.public.channel,
        element: withSuspense(<PublicHomePage />),
      },
      {
        path: ROUTES.public.radio,
        element: withSuspense(<PublicHomePage />),
      },
      {
        path: ROUTES.public.documents,
        element: withSuspense(<PublicHomePage />),
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.panel.accountSettings,
            element: withSuspense(<AccountSettingsPage />),
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.panel.adminDashboard,
            element: withSuspense(<AdminDashboardPage />),
          },
          {
            path: ROUTES.panel.users,
            element: withSuspense(<AdminUsersPage />),
          },
          {
            path: ROUTES.panel.adminNews,
            element: withSuspense(<AdminNewsPage />),
          },
          {
            path: ROUTES.panel.adminEvents,
            element: withSuspense(<AdminUsersPage />),
          },
          {
            path: ROUTES.panel.adminBroadcasts,
            element: withSuspense(<AdminBroadcastsPage />),
          },
          {
            path: ROUTES.panel.adminRadio,
            element: withSuspense(<AdminUsersPage />),
          },
          {
            path: ROUTES.panel.adminDocuments,
            element: withSuspense(<AdminUsersPage />),
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
