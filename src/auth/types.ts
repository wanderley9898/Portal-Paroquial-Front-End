import { ItemSlot } from "@/constants/item-slot";
import { SkillCategory } from "@/constants/skill-category";

export type UserRole = "super_admin" | "author" | "reader";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  document?: string | null;
  avatarUrl?: string | null;
  playerCode?: string;
  role: UserRole;
  permissions?: string[];
};

export type LoginResponse = {
  access_token: string;
  data: AuthUser;
};

export type SearchResponse<T> = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  items: T;
};

export type CategoryItem = { id: string; name: string; slug: string };
export type TagItem = { id: string; name: string; slug: string };

export type CharacterItem = {
  id: string;
  name: string;
  alias?: string | null;
  className?: string | null;
  currentChapter: number;
  avatarUrl?: string | null;
  description?: string | null;
  backstory?: string | null;
  worldType?: string | null;
  systemType?: string | null;
  attributes?: Record<string, unknown> | null;
  status?: Record<string, unknown> | null;
  inventory?: Record<string, unknown>[] | null;
  skills?: Record<string, unknown>[] | null;
  notes?: Record<string, unknown> | null;
  userId?: string | null;
  tagIds?: string[];
  attributeEntryIds?: string[];
  skillEntryIds?: string[];
  itemEntryIds?: string[];
  versionIds?: string[];
};

export type CharacterAttributeEntry = {
  id: string;
  character_id: string;
  name: string;
  type:
    | "strength"
    | "agility"
    | "intelligence"
    | "vitality"
    | "wisdom"
    | "charisma"
    | "luck"
    | "endurance";
  base_value: number | string;
  current_value: number | string;
  modifier: number | string;
  description?: string | null;
  icon?: string | null;
  is_active: boolean;
  created_at: string;
};

export type CharacterSkillEntry = {
  id: string;
  characterId: string;
  name: string;
  category: SkillCategory;
  level: number;
  experience: number;
  description?: string | null;
  requirements?: Record<string, unknown> | null;
  isActive: boolean;
  created_at: string;
};

export type CharacterItemEntry = {
  id: string;
  characterId: string;
  name: string;
  slot: ItemSlot;
  quantity: number;
  weight: number | string;
  isEquipped: boolean;
  description?: string | null;
  modifiers?: Record<string, unknown> | null;
  isActive: boolean;
  created_at: string;
};

export type CharacterVersionEntry = {
  id: string;
  characterId: string;
  timelineId?: string | null;
  parentVersionId?: string | null;
  type:
    | "base"
    | "past"
    | "present"
    | "future"
    | "alternative"
    | "non_canon"
    | "what_if"
    | "simulation";
  title: string;
  description?: string | null;
  canonical: boolean;
  tags?: string[] | null;
  snapshotOverride?: Record<string, unknown> | null;
  computedSnapshot?: Record<string, unknown> | null;
  summary?: string | null;
  chapter?: number | null;
  chapterLabel?: string | null;
  storyArc?: string | null;
  created_at: string;
};

export type CharacterTagItem = {
  id: string;
  name: string;
  description: string;
};
