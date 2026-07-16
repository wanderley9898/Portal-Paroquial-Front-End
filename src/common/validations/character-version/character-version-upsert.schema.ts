import { CharacterVersionType } from "@/constants/character-version-type";
import z from "zod";

export const characterVersionUpsertSchema = z.object({
  timelineId: z.string().uuid("Timeline ID inválido").nullable().optional(),

  parentVersionId: z
    .string()
    .uuid("Parent Version ID inválido")
    .nullable()
    .optional(),

  type: z.nativeEnum(CharacterVersionType).default(CharacterVersionType.BASE),

  title: z
    .string()
    .min(2, "Título obrigatório")
    .max(200, "Máximo de 200 caracteres"),

  description: z.string().nullable().optional(),

  canonical: z.boolean().default(true),

  tags: z.array(z.string()).nullable().optional(),

  chapter: z.coerce.number().int().min(0).optional(),

  chapterLabel: z.string().max(120).optional(),

  storyArc: z.string().max(120).optional(),

  summary: z.string().optional(),

  isCanonical: z.boolean().optional(),
});

export type CharacterVersionUpsertFormData = z.infer<
  typeof characterVersionUpsertSchema
>;
