import { CalendarIcon, Search, Star, Tv, X } from "lucide-react";
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

import { ISearchBroadcast } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BroadcastStatusEnum, BroadcastStatusLabels } from "@/utils/enums";
import { formatter } from "@/utils/formatter.util";

interface SearchBroadcastProps {
  filters?: ISearchBroadcast;
  setFilters?: (filters: ISearchBroadcast) => void;
}

const ALL_VALUE = "all";

const statusOptions = Object.entries(BroadcastStatusLabels).map(([key, label]) => ({
  key,
  label,
}));

const publishedOptions = [
  {
    key: "true",
    label: "Publicadas",
  },
  {
    key: "false",
    label: "Ocultas",
  },
];

const featuredOptions = [
  {
    key: "true",
    label: "Somente destaques",
  },
  {
    key: "false",
    label: "Todas",
  },
];

export const SearchBroadcast = ({ filters, setFilters }: SearchBroadcastProps) => {
  const [search, setSearch] = useState(filters?.filter?.q ?? "");

  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

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

  const updateFilter = (filter: Partial<NonNullable<ISearchBroadcast["filter"]>>) => {
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Pesquisa */}
        <div className="space-y-2">
          <Label htmlFor="broadcast-search">Pesquisar</Label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="broadcast-search"
              value={search}
              placeholder="Título ou descrição..."
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

        {/* Status */}
        <div className="space-y-2">
          <Label>Status da transmissão</Label>

          <Select
            value={filters?.filter?.status ?? ALL_VALUE}
            onValueChange={(value) =>
              updateFilter({
                status: value === ALL_VALUE ? undefined : (value as BroadcastStatusEnum),
              })
            }
          >
            <SelectTrigger>
              <Tv className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos os status</SelectItem>

              {statusOptions.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Publicada */}
        <div className="space-y-2">
          <Label>Publicação</Label>

          <Select
            value={
              filters?.filter?.published !== undefined
                ? String(filters.filter.published)
                : ALL_VALUE
            }
            onValueChange={(value) =>
              updateFilter({
                published: value === ALL_VALUE ? undefined : value === "true",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todas</SelectItem>

              {publishedOptions.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Destaque */}
        <div className="space-y-2">
          <Label>Destaque</Label>

          <Select
            value={
              filters?.filter?.featured !== undefined ? String(filters.filter.featured) : ALL_VALUE
            }
            onValueChange={(value) =>
              updateFilter({
                featured: value === ALL_VALUE ? undefined : value === "true",
              })
            }
          >
            <SelectTrigger>
              <Star className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Todos" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos</SelectItem>

              {featuredOptions.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Data inicial */}
        <div className="space-y-2">
          <Label>Agendada de</Label>

          <DateFilterButton
            value={filters?.filter?.scheduledFrom}
            onChange={(date) =>
              updateFilter({
                scheduledFrom: date?.toISOString(),
              })
            }
          />
        </div>

        {/* Data final */}
        <div className="space-y-2">
          <Label>Agendada até</Label>

          <DateFilterButton
            value={filters?.filter?.scheduledTo}
            onChange={(date) =>
              updateFilter({
                scheduledTo: date?.toISOString(),
              })
            }
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t pt-4">
        <Button
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
  const date = formatter.parseFilterDate(value);

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
            <CalendarIcon className="h-4 w-4" />
            {formatter.formatDisplayDate(value)}
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
