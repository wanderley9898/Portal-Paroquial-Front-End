export const ROUTES = {
  public: {
    home: "/",
    login: "/login",
    about: "/sobre",
    news: "/noticias",
    newsDetailPattern: "/noticias/:id",
    events: "/eventos",
    eventsDetailPattern: "/eventos/:id",
    broadcasts: "/transmissoes",
    bible: "/biblia",
  },

  panel: {
    users: "/usuarios",
    accountSettings: "/conta",
    adminLogin: "/admin/login",
    adminDashboard: "/admin",
    adminNews: "/admin/noticias",
    adminEvents: "/admin/eventos",
    adminBroadcasts: "/admin/transmissoes",
  },
} as const;
