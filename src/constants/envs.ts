export const API_KEY = import.meta.env.VITE_API_KEY ?? "";

export const BASE_URL = import.meta.env.VITE_BASE_API_URL ?? "http://localhost:3000";
export const BASE_API_URL = BASE_URL;
export const DOMAIN_API = `${BASE_URL}`;
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "contato@loreforge.dev";
export const TITLE = import.meta.env.VITE_TITLE ?? "Portal Paroquial";
export const LOGO_URL = import.meta.env.VITE_LOGO_URL ?? "/logo.png";
export const DESCRIPTION = import.meta.env.VITE_DESCRIPTION ?? "Portal Paroquial";
