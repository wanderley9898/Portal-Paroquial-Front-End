import {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useUpdateNewsMutation,
} from "@/common/mutations/news.mutation";
import { useNewsListQuery } from "@/common/queries/news.query";
import { AdminPageHeader } from "@/components/layout/admin-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ISearchNews, type News } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NewsUpsertModal } from "./components/modals/upsert";
import { SearchNews } from "./components/search";
import { TableNews } from "./components/table";

export default function AdminNews() {
  const [filters, setFilters] = useState<ISearchNews>({ page: 1, per_page: 20 });
  const { data, isLoading, isError } = useNewsListQuery(filters);
  const createMutation = useCreateNewsMutation();
  const updateMutation = useUpdateNewsMutation();
  const deleteMutation = useDeleteNewsMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);

  const items = data?.items ?? [];

  const handleOpenDelete = (item: News) => {
    setNewsToDelete(item);
  };

  const handleDelete = () => {
    if (!newsToDelete) return;

    deleteMutation.mutate(newsToDelete.id, {
      onSuccess: () => {
        setNewsToDelete(null);
      },
    });
  };

  return (
    <div className="space-y-4 p-4">
      <AdminPageHeader
        title="Notícias"
        description="Crie, edite, destaque ou remova notícias do portal."
        actions={
          <Button
            onClick={() => {
              setSelectedNewsId(null);
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova notícia
          </Button>
        }
      />
      <SearchNews filters={filters} setFilters={setFilters} />

      <div className="">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Carregando notícias...</div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">Não foi possível carregar as notícias.</div>
        ) : (
          <TableNews
            news={items}
            loading={isLoading}
            pagination={data}
            onPageChange={(page) =>
              setFilters((prev) => ({
                ...prev,
                page,
              }))
            }
            onOpenEdit={(item) => {
              setSelectedNewsId(item.id);
              setModalOpen(true);
            }}
            remove={handleOpenDelete}
          />
        )}
      </div>

      <NewsUpsertModal
        open={modalOpen}
        newsId={selectedNewsId}
        isSaving={createMutation.isPending || updateMutation.isPending}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setSelectedNewsId(null);
          }
        }}
        onSave={(payload, id) => {
          if (id) {
            updateMutation.mutate(
              { id, payload },
              {
                onSuccess: () => {
                  toast.success("Notícia atualizada");
                  setModalOpen(false);
                  setSelectedNewsId(null);
                },
                onError: () => {
                  toast.error("Não foi possível atualizar a notícia");
                },
              },
            );
            return;
          }

          createMutation.mutate(payload, {
            onSuccess: () => {
              toast.success("Notícia criada");
              setModalOpen(false);
              setSelectedNewsId(null);
            },
            onError: () => {
              toast.error("Não foi possível criar a notícia");
            },
          });
        }}
      />

      <ConfirmDialog
        open={!!newsToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setNewsToDelete(null);
          }
        }}
        title="Excluir notícia"
        description={
          <>
            Tem certeza que deseja excluir a notícia <strong>{newsToDelete?.title}</strong>?
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
