import { AttributeType } from "@/constants/attribute-type";
import z from "zod";

export const characterAttributeUpsertSchema = z.object({
  name: z
    .string()
    .min(2, "Nome obrigatório")
    .max(100, "Máximo de 100 caracteres"),

  type: z.nativeEnum(AttributeType),

  baseValue: z.coerce
    .number({
      required_error: "Valor base obrigatório",
    })
    .min(0, "Valor mínimo é 0")
    .max(100, "Valor máximo é 100"),

  modifier: z.coerce.number().min(-100).max(100).default(0),

  description: z.string().nullable().optional(),

  icon: z.string().max(255, "Máximo de 255 caracteres").nullable().optional(),
});

export type CharacterAttributeUpsertFormData = z.infer<
  typeof characterAttributeUpsertSchema
>;
