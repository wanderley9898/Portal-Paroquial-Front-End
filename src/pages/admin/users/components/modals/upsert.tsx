import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";

import { useAdminUserByIdQuery } from "@/common/queries/admin-user.query";
import {
  AdminUserCreateFormData,
  AdminUserFormData,
  AdminUserUpdateFormData,
  adminUserCreateSchema,
  adminUserUpdateSchema,
} from "@/common/validations/admin-user-create.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { RolesEnum } from "@/utils/enums";
import { AdminUserForm } from "../forms";

interface AdminUserUpsertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminUserId?: string | null;
  isSaving?: boolean;
  onCreate: (payload: AdminUserCreateFormData) => void;
  onUpdate: (id: string, payload: AdminUserUpdateFormData) => void;
}

const defaultValues: AdminUserFormData = {
  name: "",
  email: "",
  password: "",
  role: RolesEnum.ADMIN,
  isActive: true,
};

function mapAdminUserToFormValues(user: any): AdminUserFormData {
  return {
    name: user.name ?? "",
    email: user.email ?? "",
    password: "",
    role: user.role,
    isActive: user.isActive,
  };
}

export const AdminUserUpsertModal = ({
  open,
  onOpenChange,
  adminUserId,
  isSaving = false,
  onCreate,
  onUpdate,
}: AdminUserUpsertModalProps) => {
  const isCreate = !adminUserId;

  const { data: adminUser, isLoading, isFetching } = useAdminUserByIdQuery(adminUserId ?? "");

  const methods = useForm<AdminUserFormData>({
    resolver: zodResolver(isCreate ? adminUserCreateSchema : adminUserUpdateSchema) as Resolver<
      AdminUserFormData
    >,
    defaultValues,
  });

  const resetForm = () => {
    methods.reset(defaultValues);
    methods.clearErrors();
  };

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    if (adminUser) {
      methods.reset(mapAdminUserToFormValues(adminUser));
      return;
    }

    if (isCreate) {
      methods.reset(defaultValues);
    }
  }, [open, adminUser, isCreate, methods]);

  const isLoadingEditData = !!adminUserId && !adminUser && (isLoading || isFetching);

  const handleSubmit = methods.handleSubmit((values) => {
    if (isCreate) {
      onCreate(values);
      return;
    }

    if (!adminUserId) return;

    const { password, ...payloadWithoutPassword } = values;
    const payload = password ? { ...payloadWithoutPassword, password } : payloadWithoutPassword;

    onUpdate(adminUserId, payload);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetForm();
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Novo Administrador" : "Editar Administrador"}</DialogTitle>
        </DialogHeader>

        <div className="-mx-2 max-h-[60vh] overflow-y-auto px-2">
          <Form {...methods}>
            <form id="admin-user-upsert-form" className="space-y-6" onSubmit={handleSubmit}>
              <AdminUserForm />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            type="submit"
            form="admin-user-upsert-form"
            disabled={isSaving || isLoadingEditData}
          >
            {isSaving ? "Salvando..." : isLoadingEditData ? "Carregando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
