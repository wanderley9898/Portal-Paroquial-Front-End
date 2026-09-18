import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";

import { NewsForm } from "../forms";

import { useNewsByIdQuery } from "@/common/queries/news.query";
import { newsUpsertSchema, type NewsUpsertFormData } from "@/common/validations/news.schema";
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
import { formatter } from "@/utils/formatter.util";

interface NewsUpsertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newsId?: string | null;
  isSaving?: boolean;
  onSave: (payload: NewsUpsertFormData, id?: string) => void;
}

const defaultValues: NewsUpsertFormData = {
  title: "",
  subtitle: "",
  content: "",
  coverImage: "",
  thumbnail: "",
  category: NewsCategoryEnum.NEWS,
  featured: false,
  published: true,
  publishedAt: "",
  expiresAt: "",
  youtubeUrl: "",
  externalUrl: "",
  tags: [],
};

function mapNewsToFormValues(news: unknown): NewsUpsertFormData {
  const source = news as Partial<NewsUpsertFormData> & Record<string, unknown>;

  return {
    title: String(source.title ?? ""),
    subtitle: String(source.subtitle ?? ""),
    content: String(source.content ?? ""),
    coverImage: String(source.coverImage ?? ""),
    thumbnail: String(source.thumbnail ?? ""),
    category: (source.category as NewsCategoryEnum) ?? NewsCategoryEnum.NEWS,
    featured: Boolean(source.featured),
    published: Boolean(source.published),
    publishedAt: formatter.formatDateTimeLocal(source.publishedAt as string),
    expiresAt: formatter.formatDateTimeLocal(source.expiresAt as string),
    youtubeUrl: String(source.youtubeUrl ?? ""),
    externalUrl: String(source.externalUrl ?? ""),
    tags: Array.isArray(source.tags) ? (source.tags as string[]) : [],
  };
}

export const NewsUpsertModal = ({
  open,
  onOpenChange,
  newsId,
  isSaving = false,
  onSave,
}: NewsUpsertModalProps) => {
  const isCreate = !newsId;
  const {
    data: news,
    isFetching,
    isLoading,
  } = useNewsByIdQuery(newsId ?? "", {
    enabled: open && !!newsId,
  });

  const methods = useForm<NewsUpsertFormData>({
    resolver: zodResolver(newsUpsertSchema) as Resolver<NewsUpsertFormData>,
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

    if (news) {
      methods.reset(mapNewsToFormValues(news));
      return;
    }

    if (isCreate) {
      methods.reset(defaultValues);
    }
  }, [open, news, isCreate, methods]);

  const isLoadingEditData = !!newsId && !news && (isLoading || isFetching);

  const handleSubmit = methods.handleSubmit((values: NewsUpsertFormData) => {
    onSave(values, newsId ?? undefined);
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
          <DialogTitle>{isCreate ? "Nova notícia" : "Editar notícia"}</DialogTitle>
        </DialogHeader>
        <div className="-mx-2 max-h-[60vh] overflow-y-auto px-2">
          <Form {...methods}>
            <form id="news-upsert-form" className="space-y-8" onSubmit={handleSubmit}>
              <NewsForm />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="news-upsert-form" disabled={isSaving || isLoadingEditData}>
            {isSaving ? "Salvando..." : isLoadingEditData ? "Carregando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
