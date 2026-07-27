import { useFormContext } from "react-hook-form";

import { BroadcastUpsertFormData } from "@/common/validations/broadcast.schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BroadcastStatusEnum, BroadcastStatusLabels } from "@/utils/enums/broadcast.enum";

const statusOptions = Object.entries(BroadcastStatusLabels).map(([key, label]) => ({
  key: key as BroadcastStatusEnum,
  label,
}));

export const BroadcastForm = () => {
  const { control } = useFormContext<BroadcastUpsertFormData>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>

            <FormControl>
              <Input {...field} placeholder="Ex.: Santa Missa Dominical" />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="youtubeUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link do YouTube</FormLabel>

            <FormControl>
              <Input {...field} placeholder="https://youtube.com/watch?v=..." />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>

              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as BroadcastStatusEnum)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {statusOptions.map((option) => (
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

        <FormField
          control={control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da transmissão</FormLabel>

              <FormControl>
                <Input {...field} value={field.value ?? ""} type="datetime-local" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
