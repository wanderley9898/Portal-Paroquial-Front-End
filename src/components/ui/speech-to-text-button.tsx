import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

type SpeechToTextButtonProps = {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  className?: string;
};

export function SpeechToTextButton({
  isListening,
  isSupported,
  onToggle,
  className,
}: SpeechToTextButtonProps) {
  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size="sm"
      onClick={onToggle}
      disabled={!isSupported}
      className={className}
      title={
        isSupported
          ? isListening
            ? "Parar transcrição"
            : "Iniciar transcrição por voz"
          : "Seu navegador não suporta transcrição por voz"
      }
      aria-label={
        isSupported
          ? isListening
            ? "Parar transcrição"
            : "Iniciar transcrição por voz"
          : "Transcrição por voz não suportada"
      }
    >
      {isListening ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
