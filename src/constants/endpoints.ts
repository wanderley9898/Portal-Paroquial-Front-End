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

  adminSupport: {
    tickets: "/admin/support/tickets",
    ticketById: (id: string) => `/admin/support/tickets/${id}`,
    ticketMessages: (id: string) => `/admin/support/tickets/${id}/messages`,
    ticketStatus: (id: string) => `/admin/support/tickets/${id}/status`,
  },
} as const;
