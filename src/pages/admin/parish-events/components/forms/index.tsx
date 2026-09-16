import { useFormContext } from "react-hook-form";

import { ParishEventUpsertFormData } from "@/common/validations/parish-event.schema";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { NewsCategoryEnum, NewsCategoryLabels } from "@/utils/enums";

const categoryOptions = Object.entries(NewsCategoryLabels).map(([key, label]) => ({
  key: key as NewsCategoryEnum,
  label,
}));

export const ParishEventForm = () => {
  const { control } = useFormContext<ParishEventUpsertFormData>();

  return (
    <div className="space-y-8">
      {/* ===================== Informações principais ===================== */}
      <section className="space-y-4 rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold">Informações do evento</h3>

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do evento</FormLabel>

              <FormControl>
                <Input {...field} placeholder="Ex.: Missa de domingo" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>

              <FormControl>
                <Textarea {...field} rows={5} placeholder="Descreva o evento..." />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                    <SelectValue placeholder="Selecione a categoria..." />
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
      </section>

      {/* ===================== Data e horário ===================== */}
      <section className="space-y-4 rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold">Data e horário</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>

                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>

                <FormControl>
                  <Input {...field} type="time" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de término</FormLabel>

                <FormControl>
                  <Input {...field} value={field.value ?? ""} type="time" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* ===================== Local e responsável ===================== */}
      <section className="space-y-4 rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold">Local e responsável</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local</FormLabel>

                <FormControl>
                  <Input {...field} placeholder="Ex.: Igreja Matriz" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="responsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>

                <FormControl>
                  <Input {...field} placeholder="Ex.: Pe. João Silva" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* ===================== Imagem ===================== */}
      <section className="space-y-4 rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold">Imagem</h3>

        <FormField
          control={control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem do evento</FormLabel>

              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="https://..." />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </section>
    </div>
  );
};
