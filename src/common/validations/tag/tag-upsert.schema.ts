import z from "zod";

export const tagUpsertSchema = z.object({
  name: z
    .string()
    .min(2, "Nome obrigatório")
    .max(100, "Máximo de 100 caracteres"),

  description: z
    .string()
    .max(500, "Máximo de 500 caracteres")
    .nullable()
    .optional(),

  userId: z.string().uuid("User ID inválido"),
});

export type TagUpsertFormData = z.infer<typeof tagUpsertSchema>;
