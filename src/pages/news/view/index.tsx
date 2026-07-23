import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useNewsByIdPublicQuery } from "@/common/queries/news.query";
import { PageContainer } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { NewsCategoryLabels } from "@/lib/types";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: news, isLoading, isError } = useNewsByIdPublicQuery(id ?? "");

  if (isLoading) {
    return (
      <PageContainer className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </PageContainer>
    );
  }

  if (isError || !news) {
    return (
      <PageContainer className="py-20 text-center">
        <h2 className="font-serif text-3xl text-primary">Notícia não encontrada</h2>

        <Link
          to="/noticias"
          className="mt-6 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para notícias
        </Link>
      </PageContainer>
    );
  }

  return (
    <article>
      {news.coverImage && (
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={news.coverImage} alt={news.title} className="h-full w-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      )}

      <PageContainer className="max-w-4xl py-10">
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Todas as notícias
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge>{NewsCategoryLabels[news.category]}</Badge>

          {news.publishedAt && (
            <span className="text-sm text-muted-foreground">
              {new Date(news.publishedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}

          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            {news.views}
          </span>
        </div>

        <h1 className="mt-5 font-serif text-4xl md:text-5xl text-primary">{news.title}</h1>

        {news.subtitle && <p className="mt-4 text-xl text-muted-foreground">{news.subtitle}</p>}

        <div className="gold-divider my-8 w-24" />

        <div className="prose prose-lg max-w-none whitespace-pre-line">{news.content}</div>

        {news.authorName && (
          <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
            Publicado por <strong className="text-foreground">{news.authorName}</strong>
          </div>
        )}
      </PageContainer>
    </article>
  );
}
