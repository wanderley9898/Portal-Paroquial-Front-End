import { ArrowRight, CalendarDays, Eye, Star, User } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { News, NewsCategoryLabels } from "@/lib/types";
import { formatDisplayDate } from "@/utils/formatter.util";

interface FeaturedNewsCardProps {
  news: News;
}

export function FeaturedNewsCard({ news }: FeaturedNewsCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid lg:grid-cols-2">
        {news.coverImage && (
          <div className="relative overflow-hidden">
            <img
              src={news.coverImage}
              alt={news.title}
              className="h-full min-h-80 w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute left-5 top-5 flex gap-2">
              <Badge className="bg-primary text-primary-foreground">
                {NewsCategoryLabels[news.category]}
              </Badge>

              {news.featured && (
                <Badge className="gap-1 bg-yellow-500 text-white">
                  <Star className="h-3 w-3 fill-current" />
                  Destaque
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col p-8 lg:p-10">
          <h2 className="font-serif text-3xl font-bold leading-tight lg:text-4xl">{news.title}</h2>

          {news.subtitle && <p className="mt-4 text-lg text-muted-foreground">{news.subtitle}</p>}

          <p className="mt-6 line-clamp-6 leading-7 text-muted-foreground">{news.content}</p>

          <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted-foreground">
            {news.publishedAt && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatDisplayDate(news.publishedAt)}
              </div>
            )}

            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {news.authorName}
            </div>

            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {news.views}
            </div>
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {news.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-auto pt-8">
            <Link
              to={`/noticias/${news.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Ler notícia completa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
