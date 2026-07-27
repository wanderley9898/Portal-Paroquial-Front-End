import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";

import { BroadcastForm } from "../forms";

import { useBroadcastByIdQuery } from "@/common/queries/broadcast.query";
import {
  broadcastUpsertSchema,
  type BroadcastUpsertFormData,
} from "@/common/validations/broadcast.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { BroadcastStatusEnum } from "@/utils/enums";
import { formatDateTimeLocal } from "@/utils/formatter.util";

interface BroadcastUpsertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  broadcastId?: string | null;
  isSaving?: boolean;
  onSave: (payload: BroadcastUpsertFormData, id?: string) => void;
}

const defaultValues: BroadcastUpsertFormData = {
  title: "",
  description: "",
  youtubeUrl: "",
  thumbnail: "",
  status: BroadcastStatusEnum.UPCOMING,
  scheduledAt: "",
  featured: false,
  published: true,
};

function mapBroadcastToFormValues(broadcast: unknown): BroadcastUpsertFormData {
  const source = broadcast as Partial<BroadcastUpsertFormData> & Record<string, unknown>;

  return {
    title: String(source.title ?? ""),
    description: String(source.description ?? ""),
    youtubeUrl: String(source.youtubeUrl ?? ""),
    thumbnail: String(source.thumbnail ?? ""),
    status: (source.status as BroadcastStatusEnum) ?? BroadcastStatusEnum.UPCOMING,
    scheduledAt: formatDateTimeLocal(source.scheduledAt as string),
    featured: Boolean(source.featured),
    published: Boolean(source.published),
  };
}

export const BroadcastUpsertModal = ({
  open,
  onOpenChange,
  broadcastId,
  isSaving = false,
  onSave,
}: BroadcastUpsertModalProps) => {
  const isCreate = !broadcastId;

  const {
    data: broadcast,
    isFetching,
    isLoading,
  } = useBroadcastByIdQuery(broadcastId ?? "", {
    enabled: open && !!broadcastId,
  });

  const methods = useForm<BroadcastUpsertFormData>({
    resolver: zodResolver(broadcastUpsertSchema) as Resolver<BroadcastUpsertFormData>,
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

    if (broadcast) {
      methods.reset(mapBroadcastToFormValues(broadcast));
      return;
    }

    if (isCreate) {
      methods.reset(defaultValues);
    }
  }, [open, broadcast, isCreate, methods]);

  const isLoadingEditData = !!broadcastId && !broadcast && (isLoading || isFetching);

  const handleSubmit = methods.handleSubmit((values: BroadcastUpsertFormData) => {
    onSave(values, broadcastId ?? undefined);
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
      <DialogContent className="max-h-[90vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Nova transmissão" : "Editar transmissão"}</DialogTitle>
        </DialogHeader>

        <div className="-mx-2 max-h-[60vh] overflow-y-auto px-2">
          <Form {...methods}>
            <form id="broadcast-upsert-form" className="space-y-8" onSubmit={handleSubmit}>
              <BroadcastForm />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            type="submit"
            form="broadcast-upsert-form"
            disabled={isSaving || isLoadingEditData}
          >
            {isSaving ? "Salvando..." : isLoadingEditData ? "Carregando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
