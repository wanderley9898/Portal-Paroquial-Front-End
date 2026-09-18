import { ImagePlus, Link2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageSourceInputProps {
  value?: string | File;
  onChange: (value: string | File) => void;
  label: string;
  description?: string;
}

export function ImageSourceInput({
  value,
  onChange,
  label,
  description = "Escolha uma imagem do computador ou informe uma URL pública.",
}: ImageSourceInputProps) {
  const [mode, setMode] = useState<"upload" | "url">(value instanceof File ? "upload" : "url");
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    if (!(value instanceof File)) {
      setPreviewUrl(value || undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const handleModeChange = (nextMode: "upload" | "url") => {
    setMode(nextMode);
    onChange("");
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => onChange("")}
            aria-label={`Remover ${label.toLowerCase()}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
        <button
          type="button"
          className={cn(
            "flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-medium transition-colors",
            mode === "upload" && "bg-background text-foreground shadow-sm",
          )}
          onClick={() => handleModeChange("upload")}
        >
          <Upload className="h-3.5 w-3.5" />
          Enviar arquivo
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-medium transition-colors",
            mode === "url" && "bg-background text-foreground shadow-sm",
          )}
          onClick={() => handleModeChange("url")}
        >
          <Link2 className="h-3.5 w-3.5" />
          Usar URL
        </button>
      </div>

      {mode === "upload" ? (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-center transition-colors hover:border-primary/60 hover:bg-muted/50">
          <ImagePlus className="h-7 w-7 text-primary" />
          <span className="text-sm font-medium">Clique para selecionar uma imagem</span>
          <span className="text-xs text-muted-foreground">JPG, PNG, GIF ou WebP até 50 MB</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onChange(file);
              event.target.value = "";
            }}
          />
        </label>
      ) : (
        <Input
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://..."
          type="url"
        />
      )}

      {previewUrl && (
        <div className="overflow-hidden rounded-md border border-border bg-muted">
          <img
            src={previewUrl}
            alt={`Prévia de ${label.toLowerCase()}`}
            className="h-36 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
