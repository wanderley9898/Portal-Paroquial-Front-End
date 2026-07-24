import { BroadcastStatusEnum } from "@/utils/enums/broadcast.enum";
import z from "zod";

export const broadcastUpsertSchema = z.object({
  title: z.string().min(2, "Título obrigatório").max(150, "Máximo de 150 caracteres"),

  description: z.string().optional(),

  youtubeUrl: z.string().url("URL do YouTube inválida"),

  thumbnail: z.string().optional(),

  status: z.nativeEnum(BroadcastStatusEnum, {
    invalid_type_error: "Status inválido",
  }),

  scheduledAt: z
    .string()
    .min(1, "Data da transmissão é obrigatória")
    .transform((value) => new Date(value).toISOString()),

  featured: z.boolean().default(false),

  published: z.boolean().default(true),
});

export type BroadcastUpsertFormData = z.infer<typeof broadcastUpsertSchema>;
