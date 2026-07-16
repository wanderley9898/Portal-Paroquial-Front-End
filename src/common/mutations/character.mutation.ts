import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  characterService,
  type CharacterAttributePayload,
  type CharacterItemPayload,
  type CharacterPayload,
  type CharacterSkillPayload,
  type CharacterVersionPayload,
} from "../../lib/api/character.service";
import { queryKeysCharacter } from "../queries/character.query";

export const useCreateCharacterMutation = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CharacterPayload) => characterService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.listMine],
      });
    },
  });
};

export const useUpdateCharacterMutation = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CharacterPayload }) =>
      characterService.update(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.listMine],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.byId, variables.id],
      });
    },
  });
};

export const useDeleteCharacterMutation = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => characterService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.listMine],
      });
    },
  });
};

export const useCreateCharacterAttributeMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CharacterAttributePayload) =>
      characterService.createAttribute(characterId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.attributes, characterId],
      });
    },
  });
};

export const useUpdateCharacterAttributeMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attributeId,
      payload,
    }: {
      attributeId: string;
      payload: CharacterAttributePayload;
    }) => characterService.updateAttribute(characterId, attributeId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.attributes, characterId],
      });
    },
  });
};

export const useDeleteCharacterAttributeMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attributeId: string) =>
      characterService.removeAttribute(characterId, attributeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.attributes, characterId],
      });
    },
  });
};

export const useCreateCharacterSkillMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CharacterSkillPayload) =>
      characterService.createSkill(characterId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.skills, characterId],
      });
    },
  });
};

export const useUpdateCharacterSkillMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      skillId,
      payload,
    }: {
      skillId: string;
      payload: CharacterSkillPayload;
    }) => characterService.updateSkill(characterId, skillId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.skills, characterId],
      });
    },
  });
};

export const useDeleteCharacterSkillMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) =>
      characterService.removeSkill(characterId, skillId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.skills, characterId],
      });
    },
  });
};

export const useCreateCharacterItemMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CharacterItemPayload) =>
      characterService.createItem(characterId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.items, characterId],
      });
    },
  });
};

export const useUpdateCharacterItemMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: CharacterItemPayload;
    }) => characterService.updateItem(characterId, itemId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.items, characterId],
      });
    },
  });
};

export const useDeleteCharacterItemMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) =>
      characterService.removeItem(characterId, itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.items, characterId],
      });
    },
  });
};

export const useCreateCharacterVersionMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CharacterVersionPayload) =>
      characterService.createVersion(characterId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.versions, characterId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.byId, characterId],
      });
    },
  });
};

export const useDeleteCharacterVersionMutation = (
  token: string | undefined,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versionId: string) =>
      characterService.removeVersion(characterId, versionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCharacter.versions, characterId],
      });
    },
  });
};
