import { CheckCircle2, Pencil, Shield, Trash2, XCircle } from "lucide-react";
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
import { AdminUser, SearchResult } from "@/lib/types";
import { RolesLabels } from "@/utils/enums";

interface TableAdminUserProps {
  adminUsers?: AdminUser[];
  loading?: boolean;
  emptyContent?: string;

  topContent?: React.ReactNode;

  pagination?: SearchResult<AdminUser[]>;

  onPageChange?: (page: number) => void;

  removeActions?: boolean;

  onOpenEdit?: (user: AdminUser) => void;
  remove?: (user: AdminUser) => void;
}

export function TableAdminUser({
  adminUsers = [],
  loading = false,
  emptyContent = "Nenhum administrador encontrado.",
  removeActions = false,
  topContent,
  pagination,
  onPageChange,
  onOpenEdit,
  remove,
}: TableAdminUserProps) {
  const columns = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "email",
      label: "E-mail",
    },
    {
      id: "role",
      label: "Cargo",
    },
    {
      id: "status",
      label: "Status",
    },
  ];

  if (!removeActions) {
    columns.push({
      id: "actions",
      label: "Ações",
    });
  }

  const renderCell = (item: AdminUser, columnKey: Key) => {
    switch (columnKey) {
      case "name":
        return <div className="font-medium">{item.name}</div>;

      case "email":
        return item.email;

      case "role":
        return (
          <Badge variant="secondary">
            <Shield className="mr-1 h-3 w-3" />
            {RolesLabels[item.role]}
          </Badge>
        );

      case "status":
        return item.isActive ? (
          <Badge>
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Ativo
          </Badge>
        ) : (
          <Badge variant="secondary">
            <XCircle className="mr-1 h-3 w-3" />
            Inativo
          </Badge>
        );

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
                className={column.id === "actions" ? "w-32 text-right" : ""}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {!loading &&
            adminUsers.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{renderCell(item, column.id)}</TableCell>
                ))}
              </TableRow>
            ))}

          {!loading && adminUsers.length === 0 && (
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
