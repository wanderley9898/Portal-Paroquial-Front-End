import { CalendarIcon, Search, Tag, X } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ISearchParishEvent } from "@/lib/types";

import { cn } from "@/lib/utils";

import { NewsCategoryEnum, NewsCategoryLabels } from "@/utils/enums";

import { formatDateFilter, formatDisplayDate, parseFilterDate } from "@/utils/formatter.util";

interface SearchParishEventProps {
  filters?: ISearchParishEvent;
  setFilters?: (filters: ISearchParishEvent) => void;
}

const ALL_VALUE = "all";

const categoryOptions = Object.entries(NewsCategoryLabels).map(([key, label]) => ({
  key,
  label,
}));

export const SearchParishEvent = ({ filters, setFilters }: SearchParishEventProps) => {
  const [search, setSearch] = useState(filters?.filter?.q ?? "");

  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  /**
   * Pesquisa com debounce
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters?.({
        ...filtersRef.current,
        page: 1,
        filter: {
          ...filtersRef.current?.filter,
          q: search || undefined,
        },
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, setFilters]);

  /**
   * Atualiza um filtro específico
   */
  const updateFilter = (filter: Partial<NonNullable<ISearchParishEvent["filter"]>>) => {
    setFilters?.({
      ...filters,
      page: 1,
      filter: {
        ...filters?.filter,
        ...filter,
      },
    });
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* ===================== Pesquisa ===================== */}
        <div className="space-y-2">
          <Label htmlFor="event-search">Pesquisar</Label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="event-search"
              value={search}
              placeholder="Nome ou descrição..."
              className="pl-9 pr-9"
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* ===================== Categoria ===================== */}
        <div className="space-y-2">
          <Label>Categoria</Label>

          <Select
            value={filters?.filter?.category ?? ALL_VALUE}
            onValueChange={(value) =>
              updateFilter({
                category: value === ALL_VALUE ? undefined : (value as NewsCategoryEnum),
              })
            }
          >
            <SelectTrigger>
              <Tag className="mr-2 h-4 w-4 text-muted-foreground" />

              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todas categorias</SelectItem>

              {categoryOptions.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ===================== Data inicial ===================== */}
        <div className="space-y-2">
          <Label>Data inicial</Label>

          <DateFilterButton
            value={filters?.filter?.dateFrom}
            onChange={(date) =>
              updateFilter({
                dateFrom: date ? formatDateFilter(date) : undefined,
              })
            }
          />
        </div>

        {/* ===================== Data final ===================== */}
        <div className="space-y-2">
          <Label>Data final</Label>

          <DateFilterButton
            value={filters?.filter?.dateTo}
            onChange={(date) =>
              updateFilter({
                dateTo: date ? formatDateFilter(date) : undefined,
              })
            }
          />
        </div>
      </div>

      {/* ===================== Ações ===================== */}
      <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSearch("");

            setFilters?.({
              page: 1,
              per_page: filters?.per_page ?? 20,
              filter: {},
            });
          }}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar filtros
        </Button>
      </div>
    </div>
  );
};

interface DateFilterButtonProps {
  value?: string;
  onChange: (date?: Date) => void;
}

function DateFilterButton({ value, onChange }: DateFilterButtonProps) {
  const date = parseFilterDate(value);

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {formatDisplayDate(value)}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={onChange} />
        </PopoverContent>
      </Popover>

      {date && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(undefined)}
          aria-label="Limpar data"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
