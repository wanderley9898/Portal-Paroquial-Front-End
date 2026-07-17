import { Pencil, Star, Trash2 } from "lucide-react";
import { Key, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { News, NewsCategoryLabels } from "@/lib/types";

interface TableNewsProps {
  news?: News[];
  loading?: boolean;
  emptyContent?: string;

  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;

  removeActions?: boolean;

  onOpenEdit?: (news: News) => void;
  remove?: (id: string) => void;
}

export function TableNews({
  news = [],
  loading = false,
  emptyContent = "Nenhuma notícia encontrada.",
  removeActions = false,
  topContent,
  bottomContent,
  onOpenEdit,
  remove,
}: TableNewsProps) {
  const [selected, setSelected] = useState<News | null>(null);

  const columns = [
    {
      id: "title",
      label: "Título",
    },
    {
      id: "category",
      label: "Categoria",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "views",
      label: "Visualizações",
    },
  ];

  if (!removeActions) {
    columns.push({
      id: "actions",
      label: "Ações",
    });
  }

  const renderCell = (item: News, columnKey: Key) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex items-center gap-2">
            {item.featured && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}

            <div>
              <p className="font-medium">{item.title}</p>

              {item.subtitle && <p className="text-muted-foreground text-xs">{item.subtitle}</p>}
            </div>
          </div>
        );

      case "category":
        return NewsCategoryLabels[item.category];

      case "status":
        return item.published ? (
          <Badge>Publicado</Badge>
        ) : (
          <Badge variant="secondary">Rascunho</Badge>
        );

      case "views":
        return item.views;

      case "actions":
        return (
          <div className="flex gap-1 justify-end">
            {onOpenEdit && (
              <Button size="icon" variant="ghost" onClick={() => onOpenEdit(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {remove && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (confirm("Deseja realmente excluir esta notícia?")) {
                    remove(item.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      {topContent}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={column.id === "actions" ? "text-right w-[120px]" : ""}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {!loading &&
            news.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{renderCell(item, column.id)}</TableCell>
                ))}
              </TableRow>
            ))}

          {!loading && news.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyContent}
              </TableCell>
            </TableRow>
          )}

          {loading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Carregando...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {bottomContent}
    </div>
  );
}
