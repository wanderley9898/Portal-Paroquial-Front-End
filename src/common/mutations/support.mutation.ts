import {
  supportService,
  type CreateSupportMessagePayload,
  type CreateSupportTicketPayload,
  type SupportTicketStatus,
} from "@/lib/api/support.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysSupport } from "../queries/support.query";

export const useCreateSupportTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSupportTicketPayload) =>
      supportService.createTicket(payload),
    onSuccess: async (created) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.myTickets],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.adminTickets],
        }),
      ]);

      if (created?.id) {
        await queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.myTicketById, created.id],
        });
      }
    },
  });
};

export const useCreateSupportMyMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: CreateSupportMessagePayload;
    }) => supportService.createMyTicketMessage(ticketId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.myTickets],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.myTicketById, variables.ticketId],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.adminTickets],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.adminTicketById, variables.ticketId],
        }),
      ]);
    },
  });
};

export const useCreateSupportAdminMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: CreateSupportMessagePayload;
    }) => supportService.createAdminTicketMessage(ticketId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.myTickets],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.myTicketById, variables.ticketId],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.adminTickets],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.adminTicketById, variables.ticketId],
        }),
      ]);
    },
  });
};

export const useUpdateSupportTicketStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: SupportTicketStatus;
    }) => supportService.updateAdminTicketStatus(ticketId, { status }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.myTickets],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.myTicketById, variables.ticketId],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.adminTickets],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeysSupport.adminTicketById, variables.ticketId],
        }),
      ]);
    },
  });
};
