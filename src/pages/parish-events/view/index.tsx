import { ArrowLeft, Calendar, Clock, Eye, Loader2, MapPin, User } from "lucide-react";

import { useParishEventByIdPublicQuery } from "@/common/queries/parish-event.query";
import { PageContainer } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { NewsCategoryLabels, type NewsCategoryEnum } from "@/lib/types";
import { Link, useParams } from "react-router-dom";

function formatEventDate(date: string) {
  if (!date) return "-";

  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) return date;

  const parsedDate = new Date(year, month - 1, day);

  return parsedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading, isError } = useParishEventByIdPublicQuery(id ?? "");

  if (isLoading) {
    return (
      <PageContainer className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </PageContainer>
    );
  }

  if (isError || !event) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h1 className="font-serif text-3xl text-primary">Evento não encontrado</h1>

          <p className="mt-2 text-muted-foreground">
            O evento solicitado não existe ou não está mais disponível.
          </p>

          <Link
            to="/eventos"
            className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à agenda
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <article>
      <section className="relative h-105 overflow-hidden md:h-140">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/80 to-background" />
        )}

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent" />

        <PageContainer className="relative flex h-full max-w-4xl flex-col justify-between py-6">
          <Link
            to="/eventos"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Todos os eventos
          </Link>

          <div className="pb-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge className="border-0 bg-primary text-primary-foreground">
                {NewsCategoryLabels[event.category as NewsCategoryEnum]}
              </Badge>

              <span className="flex items-center gap-1 text-sm text-white/90">
                <Calendar className="h-4 w-4" />
                {formatEventDate(event.date)}
              </span>

              <span className="flex items-center gap-1 text-sm text-white/90">
                <Clock className="h-4 w-4" />
                {event.time}
                {event.endTime ? ` - ${event.endTime}` : ""}
              </span>

              <span className="flex items-center gap-1 text-sm text-white/90">
                <Eye className="h-4 w-4" />
                {event.views}
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.9)] md:text-6xl">
              {event.name}
            </h1>

            <div className="mt-5 flex items-center gap-2 text-lg text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,.9)]">
              <MapPin className="h-5 w-5 shrink-0" />
              {event.location}
            </div>
          </div>
        </PageContainer>
      </section>

      <div className="gold-divider w-56" />

      <PageContainer className="max-w-4xl py-10">
        <div className="grid gap-8 md:grid-cols-[1fr_280px]">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-semibold">Sobre o evento</h2>

            <div className="whitespace-pre-line text-lg leading-relaxed text-foreground/85">
              {event.description}
            </div>
          </div>

          <aside className="h-fit rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-serif text-lg font-semibold">Informações</h3>

            <div className="space-y-4 text-sm">
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Data">
                {formatEventDate(event.date)}
              </InfoRow>

              <InfoRow icon={<Clock className="h-4 w-4" />} label="Horário">
                {event.time}
                {event.endTime ? ` - ${event.endTime}` : ""}
              </InfoRow>

              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Local">
                {event.location}
              </InfoRow>

              <InfoRow icon={<User className="h-4 w-4" />} label="Responsável">
                {event.responsible}
              </InfoRow>
            </div>
          </aside>
        </div>
      </PageContainer>
    </article>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-primary">{icon}</div>
      <div>
        <p className="font-medium">{label}</p>

        <p className="mt-1 text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
