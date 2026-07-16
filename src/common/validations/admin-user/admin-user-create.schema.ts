import { z } from "zod";

export const adminUserCreateSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha com mínimo 6 caracteres"),
  role: z.enum(["author", "reader", "super_admin"]),
  isActive: z.boolean(),
});

export type AdminUserCreateFormData = z.infer<typeof adminUserCreateSchema>;
