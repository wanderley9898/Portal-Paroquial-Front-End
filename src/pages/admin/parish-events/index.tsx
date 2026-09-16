import {
  useCreateParishEventMutation,
  useDeleteParishEventMutation,
  useUpdateParishEventMutation,
} from "@/common/mutations/parish-event.mutation";

import { useParishEventListQuery } from "@/common/queries/parish-event.query";

import { AdminPageHeader } from "@/components/layout/admin-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { ISearchParishEvent, type ParishEvent } from "@/lib/types";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ParishEventUpsertModal } from "./components/modals/upsert";
import { SearchParishEvent } from "./components/search";
import { TableParishEvent } from "./components/table";

export default function AdminParishEvents() {
  const [filters, setFilters] = useState<ISearchParishEvent>({
    page: 1,
    per_page: 20,
  });

  const { data, isLoading, isError } = useParishEventListQuery(filters);

  const createMutation = useCreateParishEventMutation();
  const updateMutation = useUpdateParishEventMutation();
  const deleteMutation = useDeleteParishEventMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [eventToDelete, setEventToDelete] = useState<ParishEvent | null>(null);

  const items = data?.items ?? [];

  const handleOpenDelete = (item: ParishEvent) => {
    setEventToDelete(item);
  };

  const handleDelete = () => {
    if (!eventToDelete) return;

    deleteMutation.mutate(eventToDelete.id, {
      onSuccess: () => {
        setEventToDelete(null);
      },
    });
  };

  return (
    <div className="space-y-4 p-4">
      <AdminPageHeader
        title="Eventos"
        description="Crie, edite ou remova eventos do portal paroquial."
        actions={
          <Button
            onClick={() => {
              setSelectedEventId(null);
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo evento
          </Button>
        }
      />

      <SearchParishEvent filters={filters} setFilters={setFilters} />

      <div>
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Carregando eventos...</div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">Não foi possível carregar os eventos.</div>
        ) : (
          <TableParishEvent
            events={items}
            loading={isLoading}
            pagination={data}
            onPageChange={(page) =>
              setFilters((prev) => ({
                ...prev,
                page,
              }))
            }
            onOpenEdit={(item) => {
              setSelectedEventId(item.id);
              setModalOpen(true);
            }}
            remove={handleOpenDelete}
          />
        )}
      </div>

      <ParishEventUpsertModal
        open={modalOpen}
        eventId={selectedEventId}
        isSaving={createMutation.isPending || updateMutation.isPending}
        onOpenChange={(open) => {
          setModalOpen(open);

          if (!open) {
            setSelectedEventId(null);
          }
        }}
        onSave={(payload, id) => {
          if (id) {
            updateMutation.mutate({
              id,
              payload,
            });

            return;
          }

          createMutation.mutate(payload, {
            onSuccess: () => {
              toast.success("Evento criado com sucesso");

              setModalOpen(false);
              setSelectedEventId(null);
            },
            onError: () => {
              toast.error("Não foi possível criar o evento");
            },
          });
        }}
      />

      <ConfirmDialog
        open={!!eventToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setEventToDelete(null);
          }
        }}
        title="Excluir evento"
        description={
          <>
            Tem certeza que deseja excluir o evento <strong>{eventToDelete?.name}</strong>?
            <br />
            Esta ação não poderá ser desfeita.
          </>
        }
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        confirmText="Excluir"
        variant="destructive"
      />
    </div>
  );
}
