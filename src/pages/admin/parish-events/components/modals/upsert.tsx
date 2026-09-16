import { useParishEventByIdQuery } from "@/common/queries/parish-event.query";
import {
  parishEventUpsertSchema,
  type ParishEventUpsertFormData,
} from "@/common/validations/parish-event.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { NewsCategoryEnum } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { ParishEventForm } from "../forms";

interface ParishEventUpsertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string | null;
  isSaving?: boolean;
  onSave: (payload: ParishEventUpsertFormData, id?: string) => void;
}

const defaultValues: ParishEventUpsertFormData = {
  name: "",
  description: "",
  date: "",
  time: "",
  endTime: "",
  location: "",
  responsible: "",
  category: NewsCategoryEnum.EVENT,
  image: "",
};

function mapParishEventToFormValues(event: unknown): ParishEventUpsertFormData {
  const source = event as Partial<ParishEventUpsertFormData> & Record<string, unknown>;

  return {
    name: String(source.name ?? ""),
    description: String(source.description ?? ""),
    date: String(source.date ?? ""),
    time: String(source.time ?? ""),
    endTime: String(source.endTime ?? ""),
    location: String(source.location ?? ""),
    responsible: String(source.responsible ?? ""),
    category: (source.category as NewsCategoryEnum) ?? NewsCategoryEnum.EVENT,
    image: String(source.image ?? ""),
  };
}

export const ParishEventUpsertModal = ({
  open,
  onOpenChange,
  eventId,
  isSaving = false,
  onSave,
}: ParishEventUpsertModalProps) => {
  const isCreate = !eventId;

  const {
    data: event,
    isFetching,
    isLoading,
  } = useParishEventByIdQuery(eventId ?? "", {
    enabled: open && !!eventId,
  });

  const methods = useForm<ParishEventUpsertFormData>({
    resolver: zodResolver(parishEventUpsertSchema) as Resolver<ParishEventUpsertFormData>,
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

    if (event) {
      methods.reset(mapParishEventToFormValues(event));
      return;
    }

    if (isCreate) {
      methods.reset(defaultValues);
    }
  }, [open, event, isCreate, methods]);

  const isLoadingEditData = !!eventId && !event && (isLoading || isFetching);

  const handleSubmit = methods.handleSubmit((values: ParishEventUpsertFormData) => {
    onSave(values, eventId ?? undefined);
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
      <DialogContent className="max-h-[90vh] max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Novo evento" : "Editar evento"}</DialogTitle>
        </DialogHeader>

        <div className="-mx-2 max-h-[60vh] overflow-y-auto px-2">
          <Form {...methods}>
            <form id="parish-event-upsert-form" className="space-y-8" onSubmit={handleSubmit}>
              <ParishEventForm />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            type="submit"
            form="parish-event-upsert-form"
            disabled={isSaving || isLoadingEditData}
          >
            {isSaving ? "Salvando..." : isLoadingEditData ? "Carregando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
