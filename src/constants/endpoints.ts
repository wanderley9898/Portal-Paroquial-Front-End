export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  users: {
    me: "/users/me",
    profile: "/users/profile",
    changePassword: "/users/change-password",
    updateLogo: "/users/update-logo",
  },

  adminUsers: {
    list: "/admin/users",
    byId: (id: string) => `/admin/users/${id}`,
    updatePassword: (id: string) => `/admin/users/${id}/password`,
  },

  news: {
    listPublic: "/news/public",
    getByIdPublic: (id: string) => `/news/public/${id}`,
    list: "/news",
    getById: (id: string) => `/news/${id}`,
    create: "/news",
    update: (id: string) => `/news/${id}`,
    delete: (id: string) => `/news/${id}`,
  },

  broadcasts: {
    listPublic: "/broadcasts/public",
    getByIdPublic: (id: string) => `/broadcasts/public/${id}`,

    list: "/broadcasts",
    getById: (id: string) => `/broadcasts/${id}`,

    create: "/broadcasts",
    update: (id: string) => `/broadcasts/${id}`,
    delete: (id: string) => `/broadcasts/${id}`,
  },

  parishEvents: {
    listPublic: "/parish-events/public",
    getByIdPublic: (id: string) => `/parish-events/public/${id}`,

    list: "/parish-events",
    create: "/parish-events",
    getById: (id: string) => `/parish-events/${id}`,
    update: (id: string) => `/parish-events/${id}`,
    delete: (id: string) => `/parish-events/${id}`,
  },
} as const;
