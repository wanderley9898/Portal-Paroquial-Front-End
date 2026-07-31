export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  number: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  name: string;
  chapters: BibleChapter[];
}

class BibleService {
  private books: BibleBook[] = [];
  private loaded = false;
  private loading: Promise<void> | null = null;

  async load() {
    if (this.loaded) return;
    if (this.loading) return this.loading;

    this.loading = (async () => {
      const response = await fetch("/bible_acf.xml");

      if (!response.ok) {
        throw new Error("Não foi possível carregar a Bíblia.");
      }

      const xml = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "application/xml");

      this.books = Array.from(doc.querySelectorAll("b")).map((book) => ({
        id: book.getAttribute("id") ?? "",
        name: book.getAttribute("n") ?? "",

        chapters: Array.from(book.querySelectorAll(":scope > c")).map((chapter) => ({
          number: Number(chapter.getAttribute("n")),

          verses: Array.from(chapter.querySelectorAll(":scope > v")).map((verse) => ({
            number: Number(verse.getAttribute("n")),
            text: verse.textContent?.trim() ?? "",
          })),
        })),
      }));

      this.loaded = true;
    })();

    try {
      await this.loading;
    } finally {
      this.loading = null;
    }
  }

  async getBooks() {
    await this.load();

    return this.books.map((book) => ({
      id: book.id,
      name: book.name,
      chapters: book.chapters.length,
    }));
  }

  async getBook(bookId: string) {
    await this.load();

    return this.books.find((b) => b.id === bookId);
  }

  async getChapter(bookId: string, chapter: number) {
    await this.load();

    const book = this.books.find((b) => b.id === bookId);

    return book?.chapters.find((c) => c.number === chapter);
  }

  async search(text: string) {
    await this.load();

    const query = text.toLowerCase();

    const result: {
      bookId: string;
      book: string;
      chapter: number;
      verse: number;
      text: string;
    }[] = [];

    this.books.forEach((book) => {
      book.chapters.forEach((chapter) => {
        chapter.verses.forEach((verse) => {
          if (verse.text.toLowerCase().includes(query)) {
            result.push({
              bookId: book.id,
              book: book.name,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text,
            });
          }
        });
      });
    });

    return result;
  }
}

export const bibleService = new BibleService();

const LAST_READ_KEY = "parish:bible:last-read";

export interface LastRead {
  bookId: string;
  bookName: string;
  chapter: number;
}

export function saveLastRead(value: LastRead) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_READ_KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function readLastRead(): LastRead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_READ_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastRead;
    if (!parsed?.bookId || !parsed?.chapter) return null;
    return parsed;
  } catch {
    return null;
  }
}
