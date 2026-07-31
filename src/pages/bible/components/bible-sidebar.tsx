import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

interface BibleSidebarProps {
  books: any[];
  livro?: string;
  currentBook?: any;
  currentChapter: number;

  onSelectBook: (id: string, chapter: number) => void;
}

export function BibleSidebar({
  books,
  livro,
  currentBook,
  currentChapter,
  onSelectBook,
}: BibleSidebarProps) {
  const [open, setOpen] = useState(false);

  const [filter, setFilter] = useState("");

  const filteredBooks = books.filter((b) => b.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      {/* Botão mobile */}
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 bottom-4 z-56 lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Fundo mobile */}
      {open && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            lg:hidden
          "
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          `
          z-50
          bg-card
          border-r
          border-border/60

          fixed
          left-0
          top-0

          h-screen
          w-80

          transition-transform

          lg:sticky
          lg:top-20
          lg:h-auto
          lg:w-auto
          lg:translate-x-0
          `,

          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Cabeçalho */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            p-3
            lg:hidden
          "
        >
          <span className="font-semibold">Bíblia</span>

          <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          className="
          rounded
          border
          border-border/60
          bg-card
          "
        >
          {/* Busca */}
          <div className="border-b p-3">
            <div className="relative">
              <Search
                className="
                  absolute
                  left-2.5
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                value={filter}

                onChange={(e) => setFilter(e.target.value)}

                placeholder="Buscar livro"

                className="pl-8"
              />
            </div>
          </div>

          {/* Lista livros */}
          <ScrollArea
            className="
              h-80
              lg:h-105
            "
          >
            <ul className="p-2">
              {filteredBooks.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => {
                      onSelectBook(b.id, 1);

                      setOpen(false);
                    }}

                    className={cn(
                      `
                      flex
                      w-full
                      justify-between
                      rounded
                      px-3
                      py-2
                      text-left
                      text-sm
                      `,

                      b.id === livro ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <span>{b.name}</span>

                    <span className="text-xs opacity-70">{b.chapters}</span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        {/* Capítulos */}
        {currentBook && (
          <div
            className="
              mt-4
              rounded
              border
              border-border/60
              bg-card
              p-3
            "
          >
            <p
              className="
              mb-2
              text-xs
              uppercase
              tracking-widest
              text-gold
            "
            >
              Capítulos
            </p>

            <div
              className="
              grid
              grid-cols-6
              gap-1.5
            "
            >
              {Array.from({
                length: currentBook.chapters,
              }).map((_, i) => {
                const chapter = i + 1;

                return (
                  <button
                    key={chapter}

                    onClick={() => {
                      onSelectBook(currentBook.id, chapter);

                      setOpen(false);
                    }}

                    className={cn(
                      `
                      rounded
                      border
                      py-1
                      text-xs
                      `,

                      chapter === currentChapter
                        ? "border-gold bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    {chapter}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
