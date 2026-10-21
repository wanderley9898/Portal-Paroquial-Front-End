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

export interface BibleBookSummary {
  id: string;
  name: string;
  chapters: number;
}

interface BibleBookMetadata extends BibleBookSummary {
  folder: "antigotestamento" | "novotestamento";
}

interface BookIndexEntry {
  livro: string;
  quantidadeCap: number;
}

interface SourceBook {
  livro: string;
  capitulos: {
    capitulo: number;
    versiculos: {
      numero: number;
      texto: string;
    }[];
  }[];
}

const BOOK_NAMES: Record<string, string> = {
  Gn: "Gênesis",
  Ex: "Êxodo",
  Lv: "Levítico",
  Nm: "Números",
  Dt: "Deuteronómio",
  Js: "Livro de Josué",
  Ju: "Livro dos Juízes",
  Rt: "Livro de Rute",
  "1Sm": "Livro Primeiro de Samuel",
  "2Sm": "Livro Segundo de Samuel",
  "1Rs": "Livro Primeiro dos Reis",
  "2Rs": "Livro Segundo dos Reis",
  "1Pa": "Livro Primeiro das Crónicas",
  "2Pa": "Livro Segundo das Crónicas",
  Esd: "Livro de Esdras",
  Ne: "Livro de Neemias",
  Tob: "Livro de Tobias",
  Jdi: "Livro de Judit",
  Est: "Livro de Ester",
  Job: "Livro de Job (Jó)",
  Ps: "Salmos",
  Pv: "Livro dos Provérbios",
  Ees: "Livro do Eclesiaste",
  Cc: "Cânticos dos Cânticos",
  Sa: "Livro da Sabedoria",
  Eus: "Eclesiástico",
  Is: "Profecia de Isaías",
  Je: "Profecia de Jeremias",
  Lm: "Trenos ou Lamentações de Jeremias",
  Ba: "Profecia de Baruch",
  Ez: "Profecia de Ezequiel",
  Dn: "Profecia de Daniel",
  Os: "Oseias",
  Jl: "Profecia de Joel",
  Am: "Profecia de Amós",
  Ab: "Profecia de Abdias",
  Jn: "Profecia de Jonas",
  Mic: "Profecia de Miqueias",
  Na: "Profecia de Naum",
  Hc: "Profecia de Habucuc",
  So: "Profecia de Sofonias",
  Ag: "Profecia de Ageu",
  Zc: "Profecia de Zacarias",
  Ml: "Profecia de Malaquias",
  "1Ma": "Livro Primeiro dos Macabeus",
  "2Ma": "Livro Segundo dos Macabeus",
  Mt: "Evangelho segundo S. Mateus",
  Mc: "Evangelho segundo S. Marcos",
  Lc: "Evangelho segundo S. Lucas",
  Jo: "Evangelho segundo S. João",
  Act: "Actos dos Apóstolos",
  Rm: "Epístola aos Romanos",
  "1Co": "Primeira Epístola aos Coríntios",
  "2Co": "Segunda Epístola aos Coríntios",
  Gl: "Epístola aos Galatas",
  Ef: "Epístola aos Efésios",
  Fp: "Epístola aos Filipenses",
  Cl: "Epístola aos Colossenses",
  "1Ts": "Primeira Epístola aos Tessalonicenses",
  "2Ts": "Segunda Epístola aos Tessalonicenses",
  "1Tm": "Primeira Epístola a Timóteo",
  "2Tm": "Segunda Epístola a Timóteo",
  Tt: "Epístola a Títo",
  Fm: "Epístola a Filémon",
  Hb: "Epístola aos Hebreus",
  Tg: "Epístola de S. Tiago",
  "1Pe": "Primeira Epístola de S. Pedro",
  "2Pe": "Segunda Epístola de S. Pedro",
  "1Jo": "Primeira Epístola de S. João",
  "2Jo": "Segunda Epístolas de S. João",
  "3Jo": "Terceira Epístolas de S. João",
  Jda: "Epístola de S. Judas",
  Ap: "Apocalipse de S. João",
};

const BOOK_IDS_BY_NAME: Record<string, string> = {};
Object.entries(BOOK_NAMES).forEach(([id, name]) => {
  BOOK_IDS_BY_NAME[name] = id;
});
BOOK_IDS_BY_NAME["Atos dos Apóstolos"] = "Act";

function isBookIndex(value: unknown): value is BookIndexEntry[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        "livro" in entry &&
        typeof entry.livro === "string" &&
        "quantidadeCap" in entry &&
        typeof entry.quantidadeCap === "number" &&
        Number.isInteger(entry.quantidadeCap) &&
        entry.quantidadeCap > 0,
    )
  );
}

function isSourceBook(value: unknown): value is SourceBook {
  return (
    typeof value === "object" &&
    value !== null &&
    "livro" in value &&
    typeof value.livro === "string" &&
    "capitulos" in value &&
    Array.isArray(value.capitulos) &&
    value.capitulos.every(
      (chapter) =>
        typeof chapter === "object" &&
        chapter !== null &&
        "capitulo" in chapter &&
        typeof chapter.capitulo === "number" &&
        "versiculos" in chapter &&
        Array.isArray(chapter.versiculos) &&
        chapter.versiculos.every(
          (verse) =>
            typeof verse === "object" &&
            verse !== null &&
            "numero" in verse &&
            typeof verse.numero === "number" &&
            "texto" in verse &&
            typeof verse.texto === "string",
        ),
    )
  );
}

function isSourceBible(value: unknown): value is SourceBook[] {
  return Array.isArray(value) && value.every(isSourceBook);
}

class BibleService {
  private books: BibleBookMetadata[] | null = null;
  private booksLoading: Promise<BibleBookMetadata[]> | null = null;
  private fullBible: SourceBook[] | null = null;
  private fullBibleLoading: Promise<SourceBook[]> | null = null;
  private readonly bookCache = new Map<string, Promise<BibleBook>>();

  private async getBookIndex(): Promise<BibleBookMetadata[]> {
    if (this.books) return this.books;
    if (this.booksLoading) return this.booksLoading;

    this.booksLoading = (async () => {
      const response = await fetch("/biblia-db/listalivros.json");
      if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de livros da Bíblia.");
      }

      const data: unknown = await response.json();
      if (!isBookIndex(data)) {
        throw new Error("A lista de livros da Bíblia possui um formato inválido.");
      }

      let newTestament = false;
      const result = data.map(({ livro, quantidadeCap }) => {
        if (!BOOK_NAMES[livro]) {
          throw new Error(`O livro "${livro}" não possui nome configurado.`);
        }
        if (livro === "Mt") newTestament = true;

        return {
          id: livro,
          name: BOOK_NAMES[livro],
          chapters: quantidadeCap,
          folder: newTestament ? "novotestamento" : "antigotestamento",
        };
      });

      this.books = result;
      return result;
    })();

    try {
      return await this.booksLoading;
    } finally {
      this.booksLoading = null;
    }
  }

  private async loadBook(bookId: string): Promise<BibleBook | undefined> {
    const books = await this.getBookIndex();
    const metadata = books.find((book) => book.id === bookId);
    if (!metadata) return undefined;

    const cached = this.bookCache.get(bookId);
    if (cached) return cached;

    const loading = (async () => {
      const response = await fetch(
        `/biblia-db/${metadata.folder}/${encodeURIComponent(bookId.toLowerCase())}.json`,
      );
      if (!response.ok) {
        throw new Error(`Não foi possível carregar o livro ${metadata.name}.`);
      }

      const data: unknown = await response.json();
      if (!isSourceBook(data)) {
        throw new Error(`O arquivo do livro ${metadata.name} possui um formato inválido.`);
      }

      return {
        id: bookId,
        name: data.livro,
        chapters: data.capitulos.map((chapter) => ({
          number: chapter.capitulo,
          verses: chapter.versiculos.map((verse) => ({
            number: verse.numero,
            text: verse.texto,
          })),
        })),
      };
    })();

    this.bookCache.set(bookId, loading);
    try {
      return await loading;
    } catch (error) {
      this.bookCache.delete(bookId);
      throw error;
    }
  }

  private async loadFullBible(): Promise<SourceBook[]> {
    if (this.fullBible) return this.fullBible;
    if (this.fullBibleLoading) return this.fullBibleLoading;

    this.fullBibleLoading = (async () => {
      const response = await fetch("/biblia-db/biblia.json");
      if (!response.ok) {
        throw new Error("Não foi possível carregar a Bíblia para a pesquisa.");
      }

      const data: unknown = await response.json();
      if (!isSourceBible(data)) {
        throw new Error("O arquivo completo da Bíblia possui um formato inválido.");
      }

      this.fullBible = data;
      return data;
    })();

    try {
      return await this.fullBibleLoading;
    } finally {
      this.fullBibleLoading = null;
    }
  }

  async getBooks(): Promise<BibleBookSummary[]> {
    const books = await this.getBookIndex();
    return books.map(({ id, name, chapters }) => ({ id, name, chapters }));
  }

  async getBook(bookId: string): Promise<BibleBook | undefined> {
    return this.loadBook(bookId);
  }

  async getChapter(bookId: string, chapter: number): Promise<BibleChapter | undefined> {
    const book = await this.loadBook(bookId);
    return book?.chapters.find((item) => item.number === chapter);
  }

  async search(text: string) {
    const query = text.trim().toLocaleLowerCase();
    if (!query) return [];

    const books = await this.getBookIndex();
    const fullBible = await this.loadFullBible();
    if (fullBible.length !== books.length) {
      throw new Error("O arquivo completo da Bíblia está incompleto.");
    }

    return fullBible.flatMap((book) => {
      const bookId = BOOK_IDS_BY_NAME[book.livro];
      const metadata = books.find((item) => item.id === bookId);
      if (!metadata) {
        throw new Error(`Não foi possível identificar o livro "${book.livro}" na Bíblia.`);
      }

      return book.capitulos.flatMap((chapter) =>
        chapter.versiculos
          .map((verse) => ({
            number: verse.numero,
            text: verse.texto,
          }))
          .filter((verse) => verse.text.toLocaleLowerCase().includes(query))
          .map((verse) => ({
            bookId,
            book: metadata.name,
            chapter: chapter.capitulo,
            verse: verse.number,
            text: verse.text,
          })),
      );
    });
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
