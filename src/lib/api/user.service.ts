import { getToken } from "@/auth/session";
import type { AuthUser } from "@/auth/types";
import { ENDPOINTS } from "@/constants/endpoints";
import { BASE_API_URL } from "@/constants/envs";
import { apiRequest } from "@/services/api.service";

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
};

export type UpdatePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export const userService = {
  updateProfile: (payload: UpdateProfilePayload) =>
    apiRequest<AuthUser>(ENDPOINTS.users.profile, {
      method: "PUT",
      body: payload,
    }),

  updatePassword: (payload: UpdatePasswordPayload) =>
    apiRequest<AuthUser>(ENDPOINTS.users.changePassword, {
      method: "PUT",
      body: payload,
    }),

  updateAvatar: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(
      `${BASE_API_URL}${ENDPOINTS.users.updateLogo}`,
      {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Nao foi possivel atualizar avatar.");
    }

    return response.json() as Promise<AuthUser>;
  },
};
