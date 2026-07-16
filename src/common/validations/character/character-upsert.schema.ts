import z from "zod";

const legacyObjectLikeSchema = z.union([
  z.record(z.string(), z.unknown()),
  z.array(z.unknown()),
]);

export const characterUpsertSchema = z.object({
  name: z
    .string()
    .min(2, "Nome obrigatório")
    .max(120, "Máximo de 120 caracteres"),

  alias: z.string().max(120, "Máximo de 120 caracteres").optional(),

  className: z.string().max(120, "Máximo de 120 caracteres").optional(),

  currentChapter: z.coerce
    .number()
    .int("Capítulo deve ser inteiro")
    .min(0, "Capítulo mínimo é 0")
    .default(0),

  avatarUrl: z.string().optional(),

  description: z.string().optional(),

  backstory: z.string().optional(),

  worldType: z.string().optional(),

  systemType: z.string().optional(),

  attributes: legacyObjectLikeSchema.optional(),

  status: legacyObjectLikeSchema.optional(),

  inventory: z.array(z.record(z.string(), z.unknown())).optional(),

  skills: z.array(z.record(z.string(), z.unknown())).optional(),

  notes: legacyObjectLikeSchema.optional(),

  userId: z.string().uuid("User ID inválido").optional(),
});

export type CharacterUpsertFormData = z.infer<typeof characterUpsertSchema>;
