import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";

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
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando evento...</p>
        </div>
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
      {event.image && (
        <div className="relative h-72 w-full overflow-hidden">
          <img src={event.image} alt={event.name} className="h-full w-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      <PageContainer className="max-w-3xl">
        <Link
          to="/eventos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à agenda
        </Link>

        <Badge className="bg-primary text-primary-foreground">
          {NewsCategoryLabels[event.category as NewsCategoryEnum]}
        </Badge>

        <h1 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">{event.name}</h1>

        <div className="gold-divider my-6 w-24" />

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow icon={<Calendar className="h-4 w-4" />} label="Data">
            {formatEventDate(event.date)}
          </InfoRow>

          <InfoRow icon={<Clock className="h-4 w-4" />} label="Horário">
            {event.time}
            {event.endTime ? ` – ${event.endTime}` : ""}
          </InfoRow>

          <InfoRow icon={<MapPin className="h-4 w-4" />} label="Local">
            {event.location}
          </InfoRow>

          <InfoRow icon={<User className="h-4 w-4" />} label="Responsável">
            {event.responsible}
          </InfoRow>
        </div>

        <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-foreground/85">
          {event.description}
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
    <div className="rounded border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
        {icon}
        {label}
      </div>

      <p className="mt-1 text-foreground">{children}</p>
    </div>
  );
}
