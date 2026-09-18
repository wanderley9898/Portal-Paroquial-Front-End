import { useParishEventPublicListQuery } from "@/common/queries/parish-event.query";

import { PaginationCustom } from "@/components/custom/pagination-custom";

import { PageContainer, PageHeader } from "@/components/layout/site-header";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ISearchParishEvent, NewsCategoryEnum, NewsCategoryLabels } from "@/lib/types";

import { useState } from "react";

import { ParishEventCard } from "./components/parish-event-card";

export default function ParishEventsList() {
  const [filters, setFilters] = useState<ISearchParishEvent>({
    page: 1,
    per_page: 9,
    filter: {},
  });

  const { data, isLoading } = useParishEventPublicListQuery(filters);

  const events = data?.items ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Comunidade"
        title="Eventos paroquiais"
        description="Confira os próximos eventos, celebrações e atividades de nossa comunidade paroquial."
      />

      <PageContainer>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Buscar evento..."
            value={filters.filter?.q ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                filter: {
                  ...prev.filter,
                  q: e.target.value || undefined,
                },
              }))
            }
          />

          <Select
            value={filters.filter?.category ?? "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                filter: {
                  ...prev.filter,
                  category: value === "all" ? undefined : (value as NewsCategoryEnum),
                },
              }))
            }
          >
            <SelectTrigger className="sm:max-w-xs">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>

              {Object.entries(NewsCategoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Carregando eventos...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border bg-card py-16 text-center">
            <h2 className="font-serif text-xl font-semibold">Nenhum evento encontrado</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Não encontramos eventos para os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => (
              <ParishEventCard key={item.id} event={item} />
            ))}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <PaginationCustom
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onChange={(page) =>
              setFilters((prev) => ({
                ...prev,
                page,
              }))
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
