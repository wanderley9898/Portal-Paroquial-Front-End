import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { ReactNode } from "react";

type InfoTipProps = {
  title: string;
  children: ReactNode;
};

export function InfoTip({ title, children }: InfoTipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:bg-gold/10 hover:text-gold"
          aria-label={title}
        >
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="w-80 space-y-2">
        <p className="font-sans text-xs uppercase tracking-wider text-gold/80">
          {title}
        </p>
        <div className="font-serif text-sm leading-6 text-muted-foreground">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}
