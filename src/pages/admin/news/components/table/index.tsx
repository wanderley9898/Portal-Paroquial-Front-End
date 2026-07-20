import { Pencil, Star, Trash2 } from "lucide-react";
import { Key } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { News, NewsCategoryLabels, SearchResult } from "@/lib/types";

interface TableNewsProps {
  news?: News[];
  loading?: boolean;
  emptyContent?: string;

  topContent?: React.ReactNode;

  pagination?: SearchResult<News[]>;

  onPageChange?: (page: number) => void;

  removeActions?: boolean;

  onOpenEdit?: (news: News) => void;
  remove?: (news: News) => void;
}

export function TableNews({
  news = [],
  loading = false,
  emptyContent = "Nenhuma notícia encontrada.",
  removeActions = false,
  topContent,
  pagination,
  onPageChange,
  onOpenEdit,
  remove,
}: TableNewsProps) {
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
              <Button size="icon" variant="ghost" onClick={() => remove?.(item)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const pages = [];

  if (pagination) {
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(i);
    }
  }

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

      {pagination && pagination.totalPages >= 1 && (
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Página {pagination.currentPage} de {pagination.totalPages} • {pagination.totalItems}{" "}
            registros
          </div>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (pagination.currentPage > 1) {
                      onPageChange?.(pagination.currentPage - 1);
                    }
                  }}
                  className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === pagination.currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (pagination.currentPage < pagination.totalPages) {
                      onPageChange?.(pagination.currentPage + 1);
                    }
                  }}
                  className={
                    pagination.currentPage === pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
