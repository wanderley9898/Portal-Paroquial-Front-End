import { RolesEnum } from "@/utils/enums";
import { z } from "zod";

const baseSchema = {
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  role: z.nativeEnum(RolesEnum),
  isActive: z.boolean(),
};

export const adminUserCreateSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Senha com mínimo 6 caracteres"),
});

export const adminUserUpdateSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || value.length >= 6, "Senha com mínimo 6 caracteres"),
});

export type AdminUserCreateFormData = z.infer<typeof adminUserCreateSchema>;
export type AdminUserUpdateFormData = z.infer<typeof adminUserUpdateSchema>;
export type AdminUserFormData = Omit<AdminUserCreateFormData, "password"> & {
  password: string;
};
