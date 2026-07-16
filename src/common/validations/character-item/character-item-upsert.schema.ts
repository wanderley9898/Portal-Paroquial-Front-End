import { ItemSlot } from "@/constants/item-slot";
import z from "zod";

export const characterItemUpsertSchema = z.object({
  name: z
    .string()
    .min(2, "Nome obrigatório")
    .max(120, "Máximo de 120 caracteres"),

  slot: z.nativeEnum(ItemSlot),

  quantity: z.coerce
    .number()
    .int("Quantidade deve ser inteira")
    .min(1, "Quantidade mínima é 1")
    .default(1),

  weight: z.coerce
    .number({
      required_error: "Peso obrigatório",
    })
    .min(0, "Peso mínimo é 0")
    .default(0),

  isEquipped: z.boolean().default(false),

  description: z.string().nullable().optional(),

  modifiers: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type CharacterItemCreateFormData = z.infer<
  typeof characterItemUpsertSchema
>;
