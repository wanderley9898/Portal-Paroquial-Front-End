import { ArrowRight, CalendarDays, Clock, Eye, MapPin, User } from "lucide-react";

import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";

import { NewsCategoryLabels, ParishEvent } from "@/lib/types";
import { formatter } from "@/utils/formatter.util";

interface FeaturedParishEventCardProps {
  event: ParishEvent;
}

export function FeaturedParishEventCard({ event }: FeaturedParishEventCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid lg:grid-cols-2">
        {event.image && (
          <div className="relative overflow-hidden">
            <img
              src={event.image}
              alt={event.name}
              className="h-full min-h-80 w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute left-5 top-5">
              <Badge className="bg-primary text-primary-foreground">
                {NewsCategoryLabels[event.category]}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex flex-col p-8 lg:p-10">
          <div>
            <Badge variant="secondary" className="mb-4 gap-1">
              <CalendarDays className="h-3 w-3" />
              Evento
            </Badge>

            <h2 className="font-serif text-3xl font-bold leading-tight lg:text-4xl">
              {event.name}
            </h2>

            {event.description && (
              <p className="mt-4 line-clamp-5 text-lg leading-7 text-muted-foreground">
                {event.description}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-medium text-foreground">
                  {formatter.formatDateTimeLocal(event.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 shrink-0" />

              <span>
                {event.time}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0" />

              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 shrink-0" />

              <span>{event.responsible}</span>
            </div>

            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 shrink-0" />

              <span>{event.views} visualizações</span>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <Link
              to={`/eventos/${event.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Ver detalhes do evento
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
