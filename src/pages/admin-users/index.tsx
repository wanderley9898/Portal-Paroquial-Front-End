import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../../auth/use-auth";
import { useCreateAdminUserMutation } from "../../common/mutations/admin-user.mutation";
import { useAdminUserListQuery } from "../../common/queries/admin-user.query";
import {
  adminUserCreateSchema,
  type AdminUserCreateFormData,
} from "../../common/validations/admin-user/admin-user-create.schema";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export function AdminUsersPage() {
  const { token } = useAuth();
  const form = useForm<AdminUserCreateFormData>({
    resolver: zodResolver(adminUserCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "author",
      isActive: true,
    },
  });

  const { data, isLoading } = useAdminUserListQuery({ per_page: 100 });
  const createMutation = useCreateAdminUserMutation();

  const submit = async (values: AdminUserCreateFormData) => {
    await createMutation.mutateAsync(values);
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "author",
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-gold/15 bg-obsidian/70 p-5 shadow-panel md:p-6">
        <p className="text-[10px] uppercase tracking-caps text-gold/60 font-ui">
          Super Admin
        </p>
        <h1 className="font-display text-3xl text-parchment tracking-display">
          Administração de Usuários
        </h1>
        <p className="mt-1 text-sm text-quill font-ui">
          Gerencie contas de autores, leitores e administradores.
        </p>
      </header>

      <Card className="border-gold/15 bg-obsidian/70 shadow-panel">
        <CardHeader>
          <CardTitle>Criar usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="grid gap-3 md:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@dominio.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="author">Autor</SelectItem>
                          <SelectItem value="reader">Leitor</SelectItem>
                          <SelectItem value="super_admin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                      Ativo
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="md:col-span-2"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Criando..." : "Criar usuário"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-gold/15 bg-obsidian/70 shadow-panel">
        <CardHeader>
          <CardTitle>Usuários cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-quill font-ui">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Ativo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.isActive ? "Sim" : "Não"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
