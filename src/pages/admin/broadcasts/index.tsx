import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateBroadcastMutation,
  useDeleteBroadcastMutation,
  useUpdateBroadcastMutation,
} from "@/common/mutations/broadcast.mutation";
import { useBroadcastListQuery } from "@/common/queries/broadcast.query";
import { AdminPageHeader } from "@/components/layout/admin-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Broadcast, ISearchBroadcast } from "@/lib/types";

import { BroadcastUpsertModal } from "./components/modals/upsert";
import { SearchBroadcast } from "./components/search";
import { TableBroadcast } from "./components/table";

export default function AdminBroadcast() {
  const [filters, setFilters] = useState<ISearchBroadcast>({
    page: 1,
    per_page: 20,
  });

  const { data, isLoading, isError } = useBroadcastListQuery(filters);

  const createMutation = useCreateBroadcastMutation();
  const updateMutation = useUpdateBroadcastMutation();
  const deleteMutation = useDeleteBroadcastMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBroadcastId, setSelectedBroadcastId] = useState<string | null>(null);
  const [broadcastToDelete, setBroadcastToDelete] = useState<Broadcast | null>(null);

  const items = data?.items ?? [];

  const handleOpenDelete = (item: Broadcast) => {
    setBroadcastToDelete(item);
  };

  const handleDelete = () => {
    if (!broadcastToDelete) return;

    deleteMutation.mutate(broadcastToDelete.id, {
      onSuccess: () => {
        setBroadcastToDelete(null);
      },
    });
  };

  return (
    <div className="space-y-4 p-4">
      <AdminPageHeader
        title="Transmissões"
        description="Gerencie as transmissões ao vivo, futuras e encerradas."
        actions={
          <Button
            onClick={() => {
              setSelectedBroadcastId(null);
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova transmissão
          </Button>
        }
      />

      <SearchBroadcast filters={filters} setFilters={setFilters} />

      <div>
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Carregando transmissões...</div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">
            Não foi possível carregar as transmissões.
          </div>
        ) : (
          <TableBroadcast
            broadcasts={items}
            loading={isLoading}
            pagination={data}
            onPageChange={(page) =>
              setFilters((prev: any) => ({
                ...prev,
                page,
              }))
            }
            onOpenEdit={(item) => {
              setSelectedBroadcastId(item.id);
              setModalOpen(true);
            }}
            remove={handleOpenDelete}
          />
        )}
      </div>

      <BroadcastUpsertModal
        open={modalOpen}
        broadcastId={selectedBroadcastId}
        isSaving={createMutation.isPending || updateMutation.isPending}
        onOpenChange={(open) => {
          setModalOpen(open);

          if (!open) {
            setSelectedBroadcastId(null);
          }
        }}
        onSave={(payload, id) => {
          if (id) {
            updateMutation.mutate(
              {
                id,
                payload,
              },
              {
                onSuccess: () => {
                  toast.success("Transmissão atualizada com sucesso.");
                  setModalOpen(false);
                  setSelectedBroadcastId(null);
                },
                onError: () => {
                  toast.error("Não foi possível atualizar a transmissão.");
                },
              },
            );

            return;
          }

          createMutation.mutate(payload, {
            onSuccess: () => {
              toast.success("Transmissão criada com sucesso.");
              setModalOpen(false);
              setSelectedBroadcastId(null);
            },
            onError: () => {
              toast.error("Não foi possível criar a transmissão.");
            },
          });
        }}
      />

      <ConfirmDialog
        open={!!broadcastToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setBroadcastToDelete(null);
          }
        }}
        title="Excluir transmissão"
        description={
          <>
            Tem certeza que deseja excluir a transmissão <strong>{broadcastToDelete?.title}</strong>
            ?
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
