import { CalendarDays, Clock, Eye, MapPin, User } from "lucide-react";

import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";

import { NewsCategoryLabels, ParishEvent } from "@/lib/types";

import { cn } from "@/lib/utils";
import { formatter } from "@/utils/formatter.util";

interface ParishEventCardProps {
  event: ParishEvent;
  href?: string;
  compact?: boolean;
  showImage?: boolean;
  showResponsible?: boolean;
  showViews?: boolean;
  showCategory?: boolean;
}

export function ParishEventCard({
  event,
  href,
  compact = false,
  showImage = true,
  showResponsible = true,
  showViews = true,
  showCategory = true,
}: ParishEventCardProps) {
  return (
    <Link
      to={href ?? `/eventos/${event.id}`}
      className={cn(
        "group flex overflow-hidden rounded-xl border bg-card transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl",
        compact ? "flex-row" : "flex-col",
      )}
    >
      {showImage && event.image && (
        <div
          className={cn(
            "overflow-hidden bg-muted",
            compact ? "h-32 w-40 shrink-0" : "aspect-video w-full",
          )}
        >
          <img
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          {showCategory && <Badge variant="secondary">{NewsCategoryLabels[event.category]}</Badge>}
        </div>

        <h3 className="line-clamp-2 font-serif text-xl font-semibold transition-colors group-hover:text-primary">
          {event.name}
        </h3>

        {event.description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatter.formatDateTimeLocal(event.date)}
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {event.time}

              {event.endTime && ` - ${event.endTime}`}
            </div>

            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="max-w-[180px] truncate">{event.location}</span>
            </div>

            {showResponsible && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span className="max-w-[160px] truncate">{event.responsible}</span>
              </div>
            )}

            {showViews && (
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {event.views}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
