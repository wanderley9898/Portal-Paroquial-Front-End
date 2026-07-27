import { CalendarDays, Play, Radio, Youtube } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Broadcast } from "@/lib/types";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { BroadcastStatusEnum, BroadcastStatusLabels } from "@/utils/enums";

interface FeaturedBroadcastCardProps {
  broadcast: Broadcast;
}

export function FeaturedBroadcastCard({ broadcast }: FeaturedBroadcastCardProps) {
  const embed = youtubeEmbedUrl(broadcast.youtubeUrl);

  const formattedDate = new Date(broadcast.scheduledAt).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Vídeo */}
      <div className="overflow-hidden bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={broadcast.title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex aspect-video items-center justify-center">
            <Play className="h-12 w-12 text-white/70" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-4 p-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold lg:text-4xl">{broadcast.title}</h2>
            <div className="flex flex-wrap gap-2">
              {broadcast.featured && <Badge className="bg-yellow-500 text-white">Destaque</Badge>}

              <Badge variant="secondary">{BroadcastStatusLabels[broadcast.status]}</Badge>

              {broadcast.status === BroadcastStatusEnum.LIVE && (
                <Badge className="bg-red-600 text-white">
                  <Radio className="mr-1 h-3 w-3 fill-current" />
                  Ao vivo
                </Badge>
              )}
            </div>
          </div>
          {broadcast.description && (
            <p className="mt-4 text-lg leading-7 text-muted-foreground">{broadcast.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="capitalize">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            YouTube
          </div>
        </div>

        <a
          href={broadcast.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-56 self-items-end justify-self-end  items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Play className="h-4 w-4 fill-current" />
          Assistir no YouTube
        </a>
      </div>
    </article>
  );
}
