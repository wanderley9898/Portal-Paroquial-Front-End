import { useFormContext } from "react-hook-form";

import { NewsUpsertFormData } from "@/common/validations/news.schema";
import { ImageSourceInput } from "@/components/custom/image-source-input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NewsCategoryEnum, NewsCategoryLabels } from "@/utils/enums";

const categoryOptions = Object.entries(NewsCategoryLabels).map(([key, label]) => ({
  key: key as NewsCategoryEnum,
  label,
}));
export const NewsForm = () => {
  const { control } = useFormContext<NewsUpsertFormData>();

  return (
    <div className="space-y-8">
      {/* ===================== Informações principais ===================== */}

      <section className="space-y-4 rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold">Informações</h3>

        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o título da notícia" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtítulo</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Subtítulo da notícia" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as NewsCategoryEnum)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end gap-4">
            <FormField
              control={control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex-1 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Publicada</FormLabel>

                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex-1 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Destaque</FormLabel>

                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>

              <FormControl>
                <Textarea {...field} rows={8} placeholder="Escreva o conteúdo da notícia..." />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      {/* ===================== Imagens ===================== */}

      <section className="space-y-4 rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold">Imagens</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageSourceInput
                    label="Imagem de capa"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageSourceInput
                    label="Miniatura"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* ===================== Publicação ===================== */}

      <section className="space-y-4 rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold">Publicação</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publicar em</FormLabel>

                <FormControl>
                  <Input {...field} value={field.value ?? ""} type="datetime-local" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expira em</FormLabel>

                <FormControl>
                  <Input {...field} value={field.value ?? ""} type="datetime-local" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* ===================== Links ===================== */}

      <section className="space-y-4 rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold">Links</h3>

        <div className="space-y-4">
          <FormField
            control={control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vídeo do YouTube</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="https://youtube.com/..."
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="externalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link externo</FormLabel>

                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="https://..." />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>
    </div>
  );
};
