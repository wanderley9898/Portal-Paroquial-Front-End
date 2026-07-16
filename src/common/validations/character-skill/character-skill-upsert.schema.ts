import { SkillCategory } from "@/constants/skill-category";
import z from "zod";

export const characterSkillUpsertSchema = z.object({
  name: z
    .string()
    .min(2, "Nome obrigatório")
    .max(120, "Máximo de 120 caracteres"),

  category: z.nativeEnum(SkillCategory),

  level: z.coerce
    .number({
      required_error: "Level obrigatório",
    })
    .int("Level deve ser inteiro")
    .min(1, "Level mínimo é 1")
    .max(10, "Level máximo é 10")
    .default(1),

  experience: z.coerce
    .number()
    .int("Experiência deve ser inteira")
    .min(0, "Experiência mínima é 0")
    .default(0),

  description: z.string().nullable().optional(),

  requirements: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type CharacterSkillUpsertFormData = z.infer<
  typeof characterSkillUpsertSchema
>;
