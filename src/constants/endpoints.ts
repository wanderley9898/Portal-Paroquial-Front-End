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
} as const;
