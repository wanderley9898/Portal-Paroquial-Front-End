import {
  campaignService,
  type CampaignCharacterAttributePayload,
  type CampaignCharacterItemPayload,
  type CampaignCharacterSkillPayload,
  type CreateCampaignItemAllocationPayload,
  type CreateCampaignItemDropRulePayload,
  type CreateCampaignItemPayload,
  type CreateCampaignLogPayload,
  type CreateCampaignParticipantPayload,
  type CreateCampaignPayload,
  type CreateCampaignSessionPayload,
  type CreateCampaignTurnPayload,
  type RespondCampaignItemAllocationPayload,
  type RollSceneDropsPayload,
  type TransferCampaignCharacterItemPayload,
  type UpdateCampaignItemAllocationPayload,
  type UpdateCampaignItemDropRulePayload,
  type UpdateCampaignItemPayload,
  type UpdateCampaignLogPayload,
  type UpdateCampaignParticipantPayload,
  type UpdateCampaignPayload,
  type UpdateCampaignSessionPayload,
  type UpdateCampaignTurnPayload,
} from "@/lib/api/campaign.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysCampaign } from "../queries/campaign.query";

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) =>
      campaignService.create(payload),
    onSuccess: async (campaign) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.listMine],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaign.id],
      });
    },
  });
};

export const useUpdateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      payload,
    }: {
      campaignId: string;
      payload: UpdateCampaignPayload;
    }) => campaignService.update(campaignId, payload),
    onSuccess: async (_, { campaignId }) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.listMine],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => campaignService.remove(campaignId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.listMine],
      });
    },
  });
};

export const useCreateCampaignParticipantMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignParticipantPayload) =>
      campaignService.createParticipant(campaignId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.participants, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useUpdateCampaignParticipantMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      participantId,
      payload,
    }: {
      participantId: string;
      payload: UpdateCampaignParticipantPayload;
    }) => campaignService.updateParticipant(campaignId, participantId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.participants, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useDeleteCampaignParticipantMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) =>
      campaignService.removeParticipant(campaignId, participantId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.participants, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useCreateCampaignSessionMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignSessionPayload) =>
      campaignService.createSession(campaignId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.sessions, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useUpdateCampaignSessionMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: UpdateCampaignSessionPayload;
    }) => campaignService.updateSession(campaignId, sessionId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.sessions, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useDeleteCampaignSessionMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      campaignService.removeSession(campaignId, sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.sessions, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.currentTurn, campaignId],
      });
    },
  });
};

export const useCreateCampaignLogMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignLogPayload) =>
      campaignService.createLog(campaignId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.logs, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useUpdateCampaignLogMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      logId,
      payload,
    }: {
      logId: string;
      payload: UpdateCampaignLogPayload;
    }) => campaignService.updateLog(campaignId, logId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.logs, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useDeleteCampaignLogMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => campaignService.removeLog(campaignId, logId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.logs, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.byId, campaignId],
      });
    },
  });
};

export const useCreateCampaignTurnMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignTurnPayload) =>
      campaignService.createTurn(campaignId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.currentTurn, campaignId],
      });
    },
  });
};

export const useUpdateCampaignTurnMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      turnId,
      payload,
    }: {
      turnId: string;
      payload: UpdateCampaignTurnPayload;
    }) => campaignService.updateTurn(campaignId, turnId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.currentTurn, campaignId],
      });
    },
  });
};

export const useCreateCampaignItemMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignItemPayload) =>
      campaignService.createItem(campaignId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.items, campaignId],
      });
    },
  });
};

export const useUpdateCampaignItemMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: UpdateCampaignItemPayload;
    }) => campaignService.updateItem(campaignId, itemId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.items, campaignId],
      });
    },
  });
};

export const useDeleteCampaignItemMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) =>
      campaignService.removeItem(campaignId, itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.items, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemAllocations, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemDropRules, campaignId],
      });
    },
  });
};

export const useCreateCampaignItemAllocationMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: CreateCampaignItemAllocationPayload;
    }) => campaignService.createItemAllocation(campaignId, itemId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemAllocations, campaignId],
      });
    },
  });
};

export const useUpdateCampaignItemAllocationMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      allocationId,
      payload,
    }: {
      allocationId: string;
      payload: UpdateCampaignItemAllocationPayload;
    }) =>
      campaignService.updateItemAllocation(campaignId, allocationId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemAllocations, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.items, campaignId],
      });
    },
  });
};

export const useRespondCampaignItemAllocationMutation = (
  campaignId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      allocationId,
      payload,
    }: {
      allocationId: string;
      payload: RespondCampaignItemAllocationPayload;
    }) =>
      campaignService.respondItemAllocation(campaignId, allocationId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemAllocations, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.items, campaignId],
      });
    },
  });
};

export const useCreateCampaignItemDropRuleMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignItemDropRulePayload) =>
      campaignService.createItemDropRule(campaignId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemDropRules, campaignId],
      });
    },
  });
};

export const useUpdateCampaignItemDropRuleMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ruleId,
      payload,
    }: {
      ruleId: string;
      payload: UpdateCampaignItemDropRulePayload;
    }) => campaignService.updateItemDropRule(campaignId, ruleId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemDropRules, campaignId],
      });
    },
  });
};

export const useDeleteCampaignItemDropRuleMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: string) =>
      campaignService.removeItemDropRule(campaignId, ruleId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemDropRules, campaignId],
      });
    },
  });
};

export const useCreateCampaignCharacterAttributeMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CampaignCharacterAttributePayload) =>
      campaignService.createCharacterAttribute(
        campaignId,
        characterId,
        payload,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          queryKeysCampaign.characterAttributes,
          campaignId,
          characterId,
        ],
      });
    },
  });
};

export const useUpdateCampaignCharacterAttributeMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attributeId,
      payload,
    }: {
      attributeId: string;
      payload: Partial<CampaignCharacterAttributePayload>;
    }) =>
      campaignService.updateCharacterAttribute(
        campaignId,
        characterId,
        attributeId,
        payload,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          queryKeysCampaign.characterAttributes,
          campaignId,
          characterId,
        ],
      });
    },
  });
};

export const useDeleteCampaignCharacterAttributeMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attributeId: string) =>
      campaignService.removeCharacterAttribute(
        campaignId,
        characterId,
        attributeId,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          queryKeysCampaign.characterAttributes,
          campaignId,
          characterId,
        ],
      });
    },
  });
};

export const useCreateCampaignCharacterSkillMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CampaignCharacterSkillPayload) =>
      campaignService.createCharacterSkill(campaignId, characterId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.characterSkills, campaignId, characterId],
      });
    },
  });
};

export const useUpdateCampaignCharacterSkillMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      skillId,
      payload,
    }: {
      skillId: string;
      payload: Partial<CampaignCharacterSkillPayload>;
    }) =>
      campaignService.updateCharacterSkill(
        campaignId,
        characterId,
        skillId,
        payload,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.characterSkills, campaignId, characterId],
      });
    },
  });
};

export const useDeleteCampaignCharacterSkillMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) =>
      campaignService.removeCharacterSkill(campaignId, characterId, skillId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.characterSkills, campaignId, characterId],
      });
    },
  });
};

export const useCreateCampaignCharacterItemMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CampaignCharacterItemPayload) =>
      campaignService.createCharacterItem(campaignId, characterId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.characterItems, campaignId, characterId],
      });
    },
  });
};

export const useUpdateCampaignCharacterItemMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: Partial<CampaignCharacterItemPayload>;
    }) =>
      campaignService.updateCharacterItem(
        campaignId,
        characterId,
        itemId,
        payload,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.characterItems, campaignId, characterId],
      });
    },
  });
};

export const useDeleteCampaignCharacterItemMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) =>
      campaignService.removeCharacterItem(campaignId, characterId, itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.characterItems, campaignId, characterId],
      });
    },
  });
};

export const useTransferCampaignCharacterItemMutation = (
  campaignId: string,
  characterId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: TransferCampaignCharacterItemPayload;
    }) =>
      campaignService.transferCharacterItem(
        campaignId,
        characterId,
        itemId,
        payload,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.characterItems, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemAllocations, campaignId],
      });
    },
  });
};

export const useRollCampaignSceneDropsMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sceneKey,
      payload,
    }: {
      sceneKey: string;
      payload: RollSceneDropsPayload;
    }) => campaignService.rollSceneDrops(campaignId, sceneKey, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.itemAllocations, campaignId],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKeysCampaign.logs, campaignId],
      });
    },
  });
};
