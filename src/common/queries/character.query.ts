import { useQuery } from "@tanstack/react-query";
import {
  characterSearchService,
  characterService,
  type CharacterSearchParams,
} from "../../lib/api/character.service";

export const queryKeysCharacter = {
  listPublic: "character:list-public",
  listMine: "character:list-mine",
  byId: "character:by-id",
  search: "character:search",
  attributes: "character:attributes",
  skills: "character:skills",
  items: "character:items",
  versions: "character:versions",
} as const;

export const useCharacterPublicListQuery = (per_page = 20) => {
  return useQuery({
    queryKey: [queryKeysCharacter.listPublic, per_page],
    queryFn: () => characterService.listPublic(per_page),
    refetchOnWindowFocus: false,
  });
};

export const useCharacterByIdQuery = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [queryKeysCharacter.byId, id],
    queryFn: () => characterService.getById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

export const useCharacterMineListQuery = (per_page = 100) => {
  return useQuery({
    queryKey: [queryKeysCharacter.listMine, per_page],
    queryFn: () => characterService.listMine(per_page),

    refetchOnWindowFocus: false,
  });
};

export const useCharacterAttributesQuery = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [queryKeysCharacter.attributes, id],
    queryFn: () => characterService.listAttributes(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

export const useCharacterSkillsQuery = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [queryKeysCharacter.skills, id],
    queryFn: () => characterService.listSkills(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

export const useCharacterItemsQuery = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [queryKeysCharacter.items, id],
    queryFn: () => characterService.listItems(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

export const useCharacterVersionsQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeysCharacter.versions, id],
    queryFn: () => characterService.listVersions(id),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  });
};

export const useCharacterSearchQuery = (params: CharacterSearchParams) => {
  return useQuery({
    queryKey: [queryKeysCharacter.search, params],
    queryFn: () => characterSearchService.search(params),
    refetchOnWindowFocus: false,
  });
};
