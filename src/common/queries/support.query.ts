import {
  supportService,
  type AdminSupportSearchParams,
} from "@/lib/api/support.service";
import { useQuery } from "@tanstack/react-query";

type RealtimeQueryOptions = {
  realtime?: boolean;
  intervalMs?: number;
};

function getRealtimeQueryOptions(options?: RealtimeQueryOptions) {
  const realtime = options?.realtime === true;
  const intervalMs = options?.intervalMs ?? 2500;

  return {
    refetchOnWindowFocus: realtime,
    refetchOnReconnect: realtime,
    refetchInterval: realtime ? intervalMs : false,
    refetchIntervalInBackground: false,
    staleTime: realtime ? intervalMs : undefined,
  } as const;
}

export const queryKeysSupport = {
  myTickets: "support:my-tickets",
  myTicketById: "support:my-ticket-by-id",
  adminTickets: "support:admin-tickets",
  adminTicketById: "support:admin-ticket-by-id",
} as const;

export const useSupportMyTicketsQuery = (
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysSupport.myTickets],
    queryFn: () => supportService.listMyTickets(),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useSupportMyTicketByIdQuery = (
  ticketId: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysSupport.myTicketById, ticketId],
    queryFn: () => supportService.getMyTicketById(ticketId),
    enabled: Boolean(ticketId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useSupportAdminTicketsQuery = (
  params: AdminSupportSearchParams,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysSupport.adminTickets, params],
    queryFn: () => supportService.listAdminTickets(params),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};

export const useSupportAdminTicketByIdQuery = (
  ticketId: string,
  realtimeOptions?: RealtimeQueryOptions,
) => {
  return useQuery({
    queryKey: [queryKeysSupport.adminTicketById, ticketId],
    queryFn: () => supportService.getAdminTicketById(ticketId),
    enabled: Boolean(ticketId),
    ...getRealtimeQueryOptions(realtimeOptions),
  });
};
