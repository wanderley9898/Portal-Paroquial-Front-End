import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

interface BibleReaderProps {
  currentBook?: any;
  currentChapter: number;
  chapterQuery: any;
  lastRead: any;
  prev: () => void;
  next: () => void;
}

export function BibleReader({
  currentBook,
  currentChapter,
  chapterQuery,
  lastRead,
  prev,
  next,
}: BibleReaderProps) {
  const readerTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chapterQuery.data) return;

    readerTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentBook?.id, currentChapter, chapterQuery.data]);

  return (
    <div ref={readerTopRef}>
      <article>
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold">
              <BookOpen className="h-3.5 w-3.5" />
              Leitura
            </p>

            <h2
              className="
mt-1
font-serif
text-3xl
text-primary
"
            >
              {currentBook ? `${currentBook.name} ${currentChapter}` : "Carregando..."}
            </h2>

            {lastRead && currentBook && lastRead.bookId === currentBook.id && (
              <p
                className="
mt-1
text-xs
text-muted-foreground
"
              >
                Sua leitura fica salva neste dispositivo.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prev}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>

            <Button variant="outline" size="sm" onClick={next}>
              Próximo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </header>

        {chapterQuery.isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        )}

        {chapterQuery.isError && (
          <p className="text-sm text-destructive">Não foi possível carregar a Bíblia.</p>
        )}

        <div className="space-y-3">
          {chapterQuery.data?.verses.map((v: any) => (
            <p
              key={v.number}

              id={`v${v.number}`}

              className="
text-[17px]
leading-relaxed
text-foreground/90
"
            >
              <sup
                className="
mr-1
font-serif
text-xs
text-gold
"
              >
                {v.number}
              </sup>

              {v.text}
            </p>
          ))}
        </div>

        <div
          className="mt-10
flex
justify-between
border-t
border-border/60
pt-6
"
        >
          <Button variant="outline" onClick={prev}>
            <ChevronLeft />
            Capítulo anterior
          </Button>

          <Button variant="outline" onClick={next}>
            Próximo capítulo
            <ChevronRight />
          </Button>
        </div>
      </article>
    </div>
  );
}
