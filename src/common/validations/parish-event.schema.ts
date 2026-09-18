import z from "zod";

import { NewsCategoryEnum } from "@/utils/enums";

export const parishEventUpsertSchema = z.object({
  name: z.string().min(2, "Nome obrigatório").max(150, "Máximo de 150 caracteres"),

  description: z.string().min(10, "Descrição obrigatória"),

  date: z.string().min(1, "Data obrigatória"),

  time: z
    .string()
    .min(1, "Horário obrigatório")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido. Use o formato HH:mm"),

  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido. Use o formato HH:mm")
    .optional()
    .or(z.literal("")),

  location: z.string().min(2, "Local obrigatório").max(255, "Máximo de 255 caracteres"),

  responsible: z.string().min(2, "Responsável obrigatório").max(150, "Máximo de 150 caracteres"),

  category: z.nativeEnum(NewsCategoryEnum, {
    invalid_type_error: "Categoria inválida",
  }),

  image: z.union([z.string(), z.instanceof(File)]).optional(),
});

export type ParishEventUpsertFormData = z.infer<typeof parishEventUpsertSchema>;
