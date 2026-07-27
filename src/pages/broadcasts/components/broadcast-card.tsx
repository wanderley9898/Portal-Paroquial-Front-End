import { Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Broadcast } from "@/lib/types";
import { youtubeThumb } from "@/lib/youtube";
import { BroadcastStatusEnum, BroadcastStatusLabels, BroadcastStatusVariant } from "@/utils/enums";

interface BroadcastCardProps {
  broadcast: Broadcast;
}

export function BroadcastCard({ broadcast }: BroadcastCardProps) {
  const thumb = youtubeThumb(broadcast.youtubeUrl);
  console.log(broadcast);
  return (
    <a
      href={broadcast.youtubeUrl}
      target="_blank"
      rel="noreferrer"
      className="group overflow-hidden rounded-lg border bg-card transition hover:border-primary"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumb ? (
          <img
            src={thumb}
            alt={broadcast.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Play className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <Badge variant={BroadcastStatusVariant[broadcast.status as BroadcastStatusEnum]}>
            {BroadcastStatusLabels[broadcast.status as BroadcastStatusEnum]}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold">{broadcast.title}</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {new Date(broadcast.scheduledAt).toLocaleString("pt-BR")}
        </p>

        {broadcast.description && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{broadcast.description}</p>
        )}
      </div>
    </a>
  );
}
