import z from "zod";

import { NewsCategoryEnum } from "@/utils/enums";

export const newsUpsertSchema = z.object({
  title: z.string().min(2, "Título obrigatório").max(150, "Máximo de 150 caracteres"),

  subtitle: z.string().max(200, "Máximo de 200 caracteres").optional(),

  content: z.string().min(10, "Conteúdo obrigatório"),

  coverImage: z.union([z.string(), z.instanceof(File)]).optional(),

  thumbnail: z.union([z.string(), z.instanceof(File)]).optional(),

  category: z.nativeEnum(NewsCategoryEnum, {
    invalid_type_error: "Categoria inválida",
  }),

  featured: z.boolean().default(false),

  published: z.boolean().default(true),
  publishedAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v).toISOString() : undefined)),

  expiresAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v).toISOString() : undefined)),

  youtubeUrl: z.string().url("URL do YouTube inválida").optional().or(z.literal("")),

  externalUrl: z.string().url("URL inválida").optional().or(z.literal("")),

  tags: z.array(z.string()).default([]),
});

export type NewsUpsertFormData = z.infer<typeof newsUpsertSchema>;
