import { useAuth } from "@/auth/use-auth";
import {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useUpdateNewsMutation,
} from "@/common/mutations/news.mutation";
import { useNewsListQuery } from "@/common/queries/news.query";
import { AdminPageHeader } from "@/components/admin-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { NewsCategoryEnum, NewsCategoryLabels, type News } from "@/lib/types";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function emptyNews(authorName: string): News {
  return {
    id: crypto.randomUUID?.() ?? `${Date.now()}`,
    title: "",
    subtitle: "",
    content: "",
    category: NewsCategoryEnum.NEWS,
    featured: false,
    published: true,
    views: 0,
    authorName,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };
}

function buildNewsPayload(n: News) {
  return {
    title: n.title,
    subtitle: n.subtitle,
    content: n.content,
    coverImage: n.coverImage,
    category: n.category,
    featured: n.featured,
    published: n.published,
    publishedAt: n.publishedAt,
    expiresAt: n.expiresAt,
    youtubeUrl: n.youtubeUrl,
    tags: n.tags ?? [],
  };
}

export default function AdminNews() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useNewsListQuery({ page: 1, per_page: 100 });
  const createMutation = useCreateNewsMutation();
  const updateMutation = useUpdateNewsMutation();
  const deleteMutation = useDeleteNewsMutation();
  const [editing, setEditing] = useState<News | null>(null);

  const items = data?.items ?? [];

  const save = (n: News) => {
    const payload = buildNewsPayload(n);
    const exists = items.some((x) => x.id === n.id);

    if (exists) {
      updateMutation.mutate(
        { id: n.id, payload },
        {
          onSuccess: () => {
            toast.success("Notícia atualizada");
            setEditing(null);
          },
          onError: () => {
            toast.error("Não foi possível atualizar a notícia");
          },
        },
      );
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Notícia criada");
        setEditing(null);
      },
      onError: () => {
        toast.error("Não foi possível criar a notícia");
      },
    });
  };

  const del = (id: string) => {
    if (!confirm("Excluir esta notícia?")) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Notícia excluída");
      },
      onError: () => {
        toast.error("Não foi possível excluir a notícia");
      },
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Notícias"
        description="Crie, edite, destaque ou remova notícias do portal."
        actions={
          <Button onClick={() => setEditing(emptyNews(user?.name ?? "Admin"))}>
            <Plus className="mr-2 h-4 w-4" /> Nova notícia
          </Button>
        }
      />

      <div className="rounded border border-border bg-card">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Carregando notícias...</div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">Não foi possível carregar as notícias.</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">Nenhuma notícia cadastrada.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {n.featured && <Star className="h-3 w-3 text-gold" />}
                      <span className="font-medium">{n.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{NewsCategoryLabels[n.category]}</TableCell>
                  <TableCell>
                    {n.published ? (
                      <Badge className="bg-primary text-primary-foreground">Publicado</Badge>
                    ) : (
                      <Badge variant="outline">Rascunho</Badge>
                    )}
                  </TableCell>
                  <TableCell>{n.views}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(n)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => del(n.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing && (
        <NewsDialog
          news={editing}
          onClose={() => setEditing(null)}
          onSave={save}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}

function NewsDialog({
  news,
  onClose,
  onSave,
  isPending,
}: {
  news: News;
  onClose: () => void;
  onSave: (n: News) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<News>(news);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">
            {news.title ? "Editar notícia" : "Nova notícia"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label>Título</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Subtítulo</Label>
            <Input
              value={form.subtitle ?? ""}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as NewsCategoryEnum })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NewsCategoryLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Imagem (URL)</Label>
              <Input
                value={form.coverImage ?? ""}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Conteúdo</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <span className="text-sm">Publicado</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm({ ...form, featured: v })}
              />
              <span className="text-sm">Destaque</span>
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(form)} disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
