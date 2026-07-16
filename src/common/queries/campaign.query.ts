import {
  campaignService,
  type ListCampaignLogsOptions,
} from "@/lib/api/campaign.service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type RealtimeQueryOptions = {
  realtime?: boolean;
  intervalMs?: number;
};

function getRealtimeQueryOptions(options?: RealtimeQueryOptions) {
  const realtime = options?.realtime === true;
  const intervalMs = options?.intervalMs ?? 2000;

  return {
    refetchOnWindowFocus: realtime,
    refetchOnReconnect: realtime,
    refetchInterval: realtime ? intervalMs : false,
    refetchIntervalInBackground: false,
    staleTime: realtime ? intervalMs : undefined,
  } as const;
}

export const queryKeysCampaign = {
  listMine: "campaign:list-mine",
  byId: "campaign:by-id",
  participants: "campaign:participants",
  participantUsersOptions: "campaign:participant-users-options",
  participantCharactersOptions: "campaign:participant-characters-options",
  sessions: "campaign:sessions",
  logs: "campaign:logs",
  currentTurn: "campaign:current-turn",
  items: "campaign:items",
  itemAllocations: "campaign:item-allocations",
  itemDropRules: "campaign:item-drop-rules",
  characterAttributes: "campaign:character-attributes",
  characterSkills: "campaign:character-skills",
  characterItems: "campaign:character-items",
} as const;

export const useCampaignMineListQuery = () => {
  return useQuery({
    queryKey: [queryKeysCampaign.listMine],
    queryFn: () => campaignService.listMine(),
    refetchOnWindowFocus: false,
  });
};

export const useCampaignByIdQuery = (
  campaignId: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.byId, campaignId],
    queryFn: () => campaignService.getById(campaignId),
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignParticipantsQuery = (
  campaignId: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.participants, campaignId],
    queryFn: () => campaignService.listParticipants(campaignId),
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignParticipantUserOptionsQuery = (
  campaignId: string,
  q?: string,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.participantUsersOptions, campaignId, q],
    queryFn: () => campaignService.listParticipantUserOptions(campaignId, q),
    enabled: Boolean(campaignId),
    refetchOnWindowFocus: false,
  });
};

export const useCampaignParticipantCharacterOptionsQuery = (
  campaignId: string,
  userId?: string,
) => {
  return useQuery({
    queryKey: [
      queryKeysCampaign.participantCharactersOptions,
      campaignId,
      userId,
    ],
    queryFn: () =>
      campaignService.listParticipantCharacterOptions(campaignId, userId),
    enabled: Boolean(campaignId && userId),
    refetchOnWindowFocus: false,
  });
};

export const useCampaignSessionsQuery = (
  campaignId: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.sessions, campaignId],
    queryFn: () => campaignService.listSessions(campaignId),
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignLogsQuery = (
  campaignId: string,
  options?: ListCampaignLogsOptions,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.logs, campaignId, options],
    queryFn: () => campaignService.listLogs(campaignId, options),
    select: (response) => response.items,
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignLogsInfiniteQuery = (
  campaignId: string,
  options?: Omit<ListCampaignLogsOptions, "cursor">,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useInfiniteQuery({
    queryKey: [queryKeysCampaign.logs, "infinite", campaignId, options],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      campaignService.listLogs(campaignId, {
        ...options,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignFeedLogsQuery = (
  campaignId: string,
  options?: {
    types?: Array<"scene" | "action" | "roll" | "system" | "note">;
    search?: string;
    limit?: number;
  },
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.logs, "feed", campaignId, options],
    queryFn: () =>
      campaignService.listLogs(campaignId, {
        order: "desc",
        limit: options?.limit ?? 120,
        types: options?.types,
        search: options?.search,
      }),
    select: (response) => response.items,
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignCurrentTurnQuery = (
  campaignId: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.currentTurn, campaignId],
    queryFn: () => campaignService.getCurrentTurn(campaignId),
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignItemsQuery = (
  campaignId: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.items, campaignId],
    queryFn: () => campaignService.listItems(campaignId),
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignItemAllocationsQuery = (
  campaignId: string,
  characterId?: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.itemAllocations, campaignId, characterId],
    queryFn: () => campaignService.listItemAllocations(campaignId, characterId),
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignItemDropRulesQuery = (
  campaignId: string,
  sceneKey?: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.itemDropRules, campaignId, sceneKey],
    queryFn: () => campaignService.listItemDropRules(campaignId, sceneKey),
    enabled: Boolean(campaignId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useCampaignCharacterAttributesQuery = (
  campaignId: string,
  characterId?: string,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.characterAttributes, campaignId, characterId],
    queryFn: () =>
      campaignService.listCharacterAttributes(campaignId, characterId || ""),
    enabled: Boolean(campaignId && characterId),
    refetchOnWindowFocus: false,
  });
};

export const useCampaignCharacterSkillsQuery = (
  campaignId: string,
  characterId?: string,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.characterSkills, campaignId, characterId],
    queryFn: () =>
      campaignService.listCharacterSkills(campaignId, characterId || ""),
    enabled: Boolean(campaignId && characterId),
    refetchOnWindowFocus: false,
  });
};

export const useCampaignCharacterItemsQuery = (
  campaignId: string,
  characterId?: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysCampaign.characterItems, campaignId, characterId],
    queryFn: () =>
      campaignService.listCharacterItems(campaignId, characterId || ""),
    enabled: Boolean(campaignId && characterId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};
