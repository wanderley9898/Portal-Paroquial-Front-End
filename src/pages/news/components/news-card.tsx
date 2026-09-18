import { CalendarDays, Eye, Star, User } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { News, NewsCategoryLabels } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatter } from "@/utils/formatter.util";

interface NewsCardProps {
  news: News;
  href?: string;

  compact?: boolean;

  showImage?: boolean;
  showAuthor?: boolean;
  showViews?: boolean;
  showCategory?: boolean;
}

export function NewsCard({
  news,
  href,
  compact = false,
  showImage = true,
  showAuthor = true,
  showViews = true,
  showCategory = true,
}: NewsCardProps) {
  return (
    <Link
      to={href ?? `/noticias/${news.id}`}
      className={cn(
        "group flex overflow-hidden rounded-xl border bg-card transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl",
        compact ? "flex-row" : "flex-col",
      )}
    >
      {showImage && news.coverImage && (
        <div
          className={cn(
            "overflow-hidden bg-muted",
            compact ? "h-32 w-40 shrink-0" : "aspect-video w-full",
          )}
        >
          <img
            src={news.coverImage}
            alt={news.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          {showCategory && <Badge variant="secondary">{NewsCategoryLabels[news.category]}</Badge>}

          {news.featured && (
            <Badge className="gap-1 bg-yellow-500 text-white">
              <Star className="h-3.5 w-3.5 fill-current" />
              Destaque
            </Badge>
          )}
        </div>

        <h3 className="line-clamp-2 font-serif text-xl font-semibold transition-colors group-hover:text-primary">
          {news.title}
        </h3>

        {news.subtitle && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{news.subtitle}</p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {news.publishedAt && (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatter.formatDisplayDate(news.publishedAt)}
              </div>
            )}

            {showAuthor && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {news.authorName}
              </div>
            )}

            {showViews && (
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {news.views}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
