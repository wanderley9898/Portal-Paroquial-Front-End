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
      <section className="relative h-105 overflow-hidden md:h-140">
        {news.coverImage ? (
          <img
            src={news.coverImage}
            alt={news.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/80 to-background" />
        )}

        {/* Escurece a imagem */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Gradiente para melhorar contraste */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-black/20" />

        {/* Gradiente superior para botão */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent" />

        <PageContainer className="relative flex h-full max-w-4xl flex-col justify-between py-6">
          <div>
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Todas as notícias
            </Link>
          </div>

          <div className="pb-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge className="border-0 bg-primary text-primary-foreground">
                {NewsCategoryLabels[news.category]}
              </Badge>

              {news.publishedAt && (
                <span className="text-sm text-white/90">
                  {new Date(news.publishedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}

              <span className="flex items-center gap-1 text-sm text-white/90">
                <Eye className="h-4 w-4" />
                {news.views}
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.9)] md:text-6xl">
              {news.title}
            </h1>

            {news.subtitle && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,.9)] md:text-xl">
                {news.subtitle}
              </p>
            )}
          </div>
        </PageContainer>
      </section>
      <div className="gold-divider w-56" />

      <PageContainer className="max-w-4xl py-10">
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
