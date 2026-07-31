import { PageContainer, PageHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { bibleService, readLastRead, saveLastRead } from "@/lib/api/bible.service";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BibleReader } from "./components/bible-reader";
import { BibleSidebar } from "./components/bible-sidebar";

export default function BibliaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const livro = searchParams.get("livro") ?? undefined;
  const capParam = searchParams.get("cap");
  const parsedCap = capParam ? Number(capParam) : undefined;
  const cap = parsedCap && Number.isFinite(parsedCap) ? parsedCap : undefined;
  const q = searchParams.get("q") ?? undefined;

  const [bookFilter, setBookFilter] = useState("");
  const [searchInput, setSearchInput] = useState(q ?? "");
  const [restored, setRestored] = useState(false);

  const updateSearch = (
    next: { livro?: string; cap?: number; q?: string },
    options?: { replace?: boolean },
  ) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
        return;
      }

      params.set(key, String(value));
    });

    navigate({ search: params.toString() }, options);
  };

  const booksQuery = useQuery({
    queryKey: ["bible", "books"],
    queryFn: () => bibleService.getBooks(),
    staleTime: Infinity,
  });

  const books = booksQuery.data;

  // Retomar a última leitura (ou abrir Gênesis 1) quando não houver rota definida
  useEffect(() => {
    if (!books?.length || restored) return;
    setRestored(true);
    if (livro) return;
    const last = readLastRead();
    const target = last && books.some((b) => b.id === last.bookId) ? last : null;
    updateSearch(
      {
        livro: target?.bookId ?? books[0].id,
        cap: target?.chapter ?? 1,
      },
      { replace: true },
    );
  }, [books, livro, restored]);

  const currentBook = books?.find((b) => b.id === livro);
  const currentChapter = cap && cap > 0 ? cap : 1;

  const chapterQuery = useQuery({
    queryKey: ["bible", "chapter", livro, currentChapter],
    queryFn: () => bibleService.getChapter(livro!, currentChapter),
    enabled: Boolean(livro),
    staleTime: Infinity,
  });

  const searchQuery = useQuery({
    queryKey: ["bible", "search", q],
    queryFn: () => bibleService.search(q!),
    enabled: Boolean(q && q.trim().length >= 3),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (currentBook) {
      saveLastRead({
        bookId: currentBook.id,
        bookName: currentBook.name,
        chapter: currentChapter,
      });
    }
  }, [currentBook, currentChapter]);

  const goTo = (bookId: string, chapter: number) =>
    updateSearch({ livro: bookId, cap: chapter, q: undefined });

  const bookIndex = books?.findIndex((b) => b.id === livro) ?? -1;

  const prev = () => {
    if (!books || bookIndex < 0) return;
    if (currentChapter > 1) return goTo(books[bookIndex].id, currentChapter - 1);
    if (bookIndex > 0) {
      const p = books[bookIndex - 1];
      return goTo(p.id, p.chapters);
    }
  };

  const next = () => {
    if (!books || bookIndex < 0) return;
    const b = books[bookIndex];
    if (currentChapter < b.chapters) return goTo(b.id, currentChapter + 1);
    if (bookIndex < books.length - 1) return goTo(books[bookIndex + 1].id, 1);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchInput.trim();
    updateSearch({ q: value.length >= 3 ? value : undefined });
  };

  const lastRead = typeof window !== "undefined" ? readLastRead() : null;
  return (
    <>
      <PageHeader
        eyebrow="Palavra de Deus"
        title="Bíblia Sagrada"
        description="Almeida Corrigida Fiel — navegue por livros e capítulos, pesquise versículos e continue a leitura de onde parou."
      />

      <PageContainer className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <BibleSidebar
          books={books ?? []}
          livro={livro}
          currentBook={currentBook}
          currentChapter={currentChapter}
          onSelectBook={(id, chapter) => goTo(id, chapter)}
        />

        {/* Leitura */}
        <section>
          <form onSubmit={submitSearch} className="mb-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Pesquisar versículo (mín. 3 letras)"
                className="pl-8"
              />
            </div>
            <Button type="submit">Pesquisar</Button>
            {q && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchInput("");
                  updateSearch({ q: undefined });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>

          {q ? (
            <div>
              <h2 className="font-serif text-2xl text-primary">Resultados para “{q}”</h2>
              {searchQuery.isLoading && (
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              )}
              {searchQuery.data && (
                <>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchQuery.data.length} versículo(s) encontrado(s)
                    {searchQuery.data.length > 200 && " — exibindo os 200 primeiros"}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {searchQuery.data.slice(0, 200).map((r) => (
                      <li key={`${r.bookId}-${r.chapter}-${r.verse}`}>
                        <button
                          onClick={() => goTo(r.bookId, r.chapter)}
                          className="w-full rounded border border-border/60 bg-card p-4 text-left transition-colors hover:border-gold"
                        >
                          <span className="text-xs uppercase tracking-widest text-gold">
                            {r.book} {r.chapter}:{r.verse}
                          </span>
                          <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                            {r.text}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <BibleReader
              currentBook={currentBook}
              currentChapter={currentChapter}
              chapterQuery={chapterQuery}
              lastRead={lastRead}
              prev={prev}
              next={next}
            />
          )}
        </section>
      </PageContainer>
    </>
  );
}
