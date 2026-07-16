import type { AuthUser, LoginResponse } from "../../auth/types";
import { ENDPOINTS } from "../../constants/endpoints";
import { apiRequest } from "../../services/api.service";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  acceptedLegal: boolean;
  legalVersion: string;
};

export const authService = {
  login: (payload: LoginPayload) =>
    apiRequest<LoginResponse>(ENDPOINTS.auth.login, {
      method: "POST",
      body: payload,
    }),

  register: (payload: RegisterPayload) =>
    apiRequest<LoginResponse>(ENDPOINTS.auth.register, {
      method: "POST",
      body: payload,
    }),

  me: () =>
    apiRequest<AuthUser>(ENDPOINTS.users.me, {
      method: "GET",
    }),
};
