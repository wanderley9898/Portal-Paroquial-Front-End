import { AdminUserFormData } from "@/common/validations/admin-user-create.schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RolesEnum, RolesLabels } from "@/utils/enums";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const roleOptions = Object.entries(RolesLabels)
  .filter(([key]) => key !== RolesEnum.SUPER_ADMIN)
  .map(([key, label]) => ({
    key: key as RolesEnum,
    label,
  }));

export const AdminUserForm = () => {
  const { control } = useFormContext<AdminUserFormData>();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>

            <FormControl>
              <Input {...field} placeholder="Nome completo" />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail</FormLabel>

            <FormControl>
              <Input {...field} type="email" placeholder="email@exemplo.com" />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha</FormLabel>

            <FormControl>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  className="pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>

              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as RolesEnum)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex h-full flex-col justify-end">
              <FormLabel>Usuário ativo</FormLabel>

              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
