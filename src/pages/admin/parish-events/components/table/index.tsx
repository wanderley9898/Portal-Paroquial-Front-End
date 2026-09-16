import { Pencil, Trash2 } from "lucide-react";
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

import { NewsCategoryLabels, ParishEvent, SearchResult } from "@/lib/types";

interface TableParishEventProps {
  events?: ParishEvent[];
  loading?: boolean;
  emptyContent?: string;
  topContent?: React.ReactNode;
  pagination?: SearchResult<ParishEvent[]>;
  onPageChange?: (page: number) => void;
  removeActions?: boolean;
  onOpenEdit?: (event: ParishEvent) => void;
  remove?: (event: ParishEvent) => void;
}

function formatDate(date: string) {
  if (!date) return "-";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function formatTime(time?: string, endTime?: string) {
  if (!time) return "-";

  if (endTime) {
    return `${time} - ${endTime}`;
  }

  return time;
}

export function TableParishEvent({
  events = [],
  loading = false,
  emptyContent = "Nenhum evento encontrado.",
  topContent,
  pagination,
  onPageChange,
  removeActions = false,
  onOpenEdit,
  remove,
}: TableParishEventProps) {
  const columns = [
    {
      id: "name",
      label: "Evento",
    },
    {
      id: "date",
      label: "Data",
    },
    {
      id: "time",
      label: "Horário",
    },
    {
      id: "location",
      label: "Local",
    },
    {
      id: "category",
      label: "Categoria",
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

  const renderCell = (item: ParishEvent, columnKey: Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div>
            <p className="font-medium">{item.name}</p>

            {item.description && (
              <p className="max-w-[350px] truncate text-xs text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
        );

      case "date":
        return <span className="whitespace-nowrap">{formatDate(item.date)}</span>;

      case "time":
        return <span className="whitespace-nowrap">{formatTime(item.time, item.endTime)}</span>;

      case "location":
        return <span className="max-w-[220px] truncate block">{item.location}</span>;

      case "category":
        return <Badge variant="outline">{NewsCategoryLabels[item.category]}</Badge>;

      case "views":
        return item.views;

      case "actions":
        return (
          <div className="flex justify-end gap-1">
            {onOpenEdit && (
              <Button size="icon" variant="ghost" onClick={() => onOpenEdit(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {remove && (
              <Button size="icon" variant="ghost" onClick={() => remove(item)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const pages: number[] = [];

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
                className={column.id === "actions" ? "w-[120px] text-right" : ""}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {!loading &&
            events.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{renderCell(item, column.id)}</TableCell>
                ))}
              </TableRow>
            ))}

          {!loading && events.length === 0 && (
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
