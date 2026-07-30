import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
} from "@/common/mutations/admin-user.mutation";
import { useAdminUserListQuery } from "@/common/queries/admin-user.query";
import { AdminPageHeader } from "@/components/layout/admin-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AdminUserSearchType } from "@/lib/api/admin-user.service";

import { AdminUserUpsertModal } from "./components/modals/upsert";

import { AdminUser } from "@/lib/types";
import { TableAdminUser } from "./components/table";

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<AdminUserSearchType>({
    page: 1,
    per_page: 20,
  });

  const { data, isLoading, isError } = useAdminUserListQuery(filters);

  const createMutation = useCreateAdminUserMutation();
  const updateMutation = useUpdateAdminUserMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const items = data?.items ?? [];

  const handleOpenDelete = (item: AdminUser) => {
    setUserToDelete(item);
  };

  const handleDelete = () => {
    if (!userToDelete) return;

    // implementar quando criar a mutation de delete
    // deleteMutation.mutate(userToDelete.id)

    setUserToDelete(null);
  };

  return (
    <div className="space-y-4 p-4">
      <AdminPageHeader
        title="Administradores"
        description="Gerencie os usuários administrativos do sistema."
        actions={
          <Button
            onClick={() => {
              setSelectedUserId(null);
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo administrador
          </Button>
        }
      />

      <div>
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Carregando administradores...</div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">
            Não foi possível carregar os administradores.
          </div>
        ) : (
          <TableAdminUser
            adminUsers={items}
            loading={isLoading}
            pagination={data}
            onPageChange={(page) =>
              setFilters((prev) => ({
                ...prev,
                page,
              }))
            }
            onOpenEdit={(item) => {
              setSelectedUserId(item.id);
              setModalOpen(true);
            }}
            remove={handleOpenDelete}
          />
        )}
      </div>

      <AdminUserUpsertModal
        open={modalOpen}
        adminUserId={selectedUserId}
        isSaving={createMutation.isPending || updateMutation.isPending}
        onOpenChange={(open) => {
          setModalOpen(open);

          if (!open) {
            setSelectedUserId(null);
          }
        }}
        onCreate={(payload) => {
          createMutation.mutate(payload, {
            onSuccess: () => {
              toast.success("Administrador criado com sucesso.");
              setModalOpen(false);
              setSelectedUserId(null);
            },
            onError: () => {
              toast.error("Não foi possível criar o administrador.");
            },
          });
        }}
        onUpdate={(id, payload) => {
          updateMutation.mutate(
            {
              id,
              payload,
            },
            {
              onSuccess: () => {
                toast.success("Administrador atualizado com sucesso.");
                setModalOpen(false);
                setSelectedUserId(null);
              },
              onError: () => {
                toast.error("Não foi possível atualizar o administrador.");
              },
            },
          );
        }}
      />

      <ConfirmDialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setUserToDelete(null);
          }
        }}
        title="Excluir administrador"
        description={
          <>
            Tem certeza que deseja excluir o administrador <strong>{userToDelete?.name}</strong>?
            <br />
            Esta ação não poderá ser desfeita.
          </>
        }
        onConfirm={handleDelete}
        loading={false}
        confirmText="Excluir"
        variant="destructive"
      />
    </div>
  );
}
