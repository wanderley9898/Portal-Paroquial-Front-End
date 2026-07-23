import { useNewsPublicListQuery } from "@/common/queries/news.query";
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
import { ISearchNews, NewsCategoryEnum, NewsCategoryLabels } from "@/lib/types";
import { useState } from "react";
import { NewsCard } from "./components/news-card";

export default function NewsList() {
  const [filters, setFilters] = useState<ISearchNews>({
    page: 1,
    per_page: 9,
    filter: {},
  });

  const { data, isLoading } = useNewsPublicListQuery(filters);

  const news = data?.items ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Comunicação"
        title="Notícias e comunicados"
        description="Fique por dentro do que acontece em nossa comunidade paroquial."
      />
      <PageContainer>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Buscar notícia..."
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
              {Object.entries(NewsCategoryLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
        {data && (
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
