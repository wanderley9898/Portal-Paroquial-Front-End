export enum NewsCategoryEnum {
  NEWS = "news",
  NOTICE = "notice",
  EVENT = "event",
  NOVENA = "novena",
  MASS = "mass",
  CAMPAIGN = "campaign",
  COMMUNITY = "community",
  PASTORAL = "pastoral",
  CATECHESIS = "catechesis",
  YOUTH = "youth",
  CHARITY = "charity",
  LITURGY = "liturgy",
  FORMATION = "formation",
  OTHER = "other",
}

export const NewsCategoryLabels: Record<NewsCategoryEnum, string> = {
  [NewsCategoryEnum.NEWS]: "Notícia",
  [NewsCategoryEnum.NOTICE]: "Comunicado",
  [NewsCategoryEnum.EVENT]: "Evento",
  [NewsCategoryEnum.NOVENA]: "Novena",
  [NewsCategoryEnum.MASS]: "Missa",
  [NewsCategoryEnum.CAMPAIGN]: "Campanha",
  [NewsCategoryEnum.COMMUNITY]: "Comunidade",
  [NewsCategoryEnum.PASTORAL]: "Pastoral",
  [NewsCategoryEnum.CATECHESIS]: "Catequese",
  [NewsCategoryEnum.YOUTH]: "Juventude",
  [NewsCategoryEnum.CHARITY]: "Ação Social",
  [NewsCategoryEnum.LITURGY]: "Liturgia",
  [NewsCategoryEnum.FORMATION]: "Formação",
  [NewsCategoryEnum.OTHER]: "Outro",
};

export enum RolesEnum {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  SECRETARY = "secretary",
  COMMUNICATION = "communication",
  EDITOR = "editor",
}

export const RolesLabels: Record<RolesEnum, string> = {
  [RolesEnum.SUPER_ADMIN]: "Super Administrador",
  [RolesEnum.ADMIN]: "Administrador",
  [RolesEnum.SECRETARY]: "Secretaria",
  [RolesEnum.COMMUNICATION]: "Comunicação",
  [RolesEnum.EDITOR]: "Editor",
};

export interface News {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  category: NewsCategoryEnum;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  expiresAt?: string;
  youtubeUrl?: string;
  tags?: string[];
  views: number;
  authorName: string;
}

export interface ParishEvent {
  id: string;
  name: string;
  description: string;
  date: string; // ISO date
  time: string; // HH:mm
  endTime?: string;
  location: string;
  responsible: string;
  category: NewsCategoryEnum;
  image?: string;
  views: number;
}

export type BroadcastStatus = "live" | "upcoming" | "past";

export interface Broadcast {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  scheduledAt: string;
  status: BroadcastStatus;
  thumbnail?: string;
}

export interface RadioProgram {
  id: string;
  name: string;
  host: string;
  description?: string;
  startTime: string; // HH:mm
  endTime: string;
  days: number[]; // 0-6 (dom-sab)
}

export interface ParishDocument {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  fileType: string;
  size?: string;
  uploadedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: RolesEnum;
  createdAt: string;
}
