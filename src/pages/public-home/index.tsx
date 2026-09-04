import { useNewsPublicListQuery } from "@/common/queries/news.query";
import { Button } from "@/components/ui/button";
import { TITLE } from "@/constants/envs";
import { listItems } from "@/lib/mock/store";
import { Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { FeaturedNewsCard } from "../news/components/featured-news-card";
import { NewsCard } from "../news/components/news-card";

export function PublicHomePage() {
  const { data: newsData, isLoading } = useNewsPublicListQuery({
    page: 1,
    per_page: 10,
    filter: {
      published: true,
      onlyVisible: true,
    },
  });
  const { data: featuredNews, isLoading: featuredNewsLoading } = useNewsPublicListQuery({
    page: 1,
    per_page: 1,
    filter: {
      published: true,
      onlyVisible: true,
      featured: true,
    },
  });

  const featured = featuredNews?.items[0] ?? null;
  const latest = newsData?.items.filter((n) => n.id !== featured?.id).slice(0, 6) ?? [];

  const events = listItems("events")
    .filter((e) => new Date(e.date) >= new Date(Date.now() - 86400000))
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 4);
  const upcomingBroadcast = listItems("broadcasts").find((b) => b.status === "upcoming");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1548407260-da850faa41e3?w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
          <div className="gold-divider mx-auto mb-6 w-24" />
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Bem-vindo</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">{TITLE}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Uma comunidade viva de fé, oração e serviço. Acompanhe as missas, novenas e eventos da
            nossa paróquia.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/transmissoes">
                <Youtube className="mr-2 h-4 w-4" />
                Assistir ao vivo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live / broadcast strip */}
      {upcomingBroadcast && (
        <section className="border-b border-border/60 bg-parchment">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-destructive" />
              <span className="text-xs uppercase tracking-widest text-primary">
                Próxima transmissão
              </span>
              <span className="text-sm text-foreground">{upcomingBroadcast.title}</span>
            </div>
            <Link to="/transmissoes" className="text-sm font-medium text-primary hover:underline">
              Ver detalhes →
            </Link>
          </div>
        </section>
      )}

      {/* Featured news */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <FeaturedNewsCard news={featured} />
        </section>
      )}

      {/* Latest news + upcoming events */}
      <section className="border-y border-border/60 bg-parchment">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <SectionTitle title="Últimas notícias" href="/noticias" />

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-72 animate-pulse rounded-lg bg-muted" />
                  ))
                : latest.map((news) => <NewsCard key={news.id} news={news} />)}
            </div>
          </div>

          {/*} <div>
            <SectionTitle title="Próximos eventos" href="/eventos" />
            <ul className="mt-6 space-y-4">
              {events.map((e) => {
                const d = new Date(e.date);
                return (
                  <li key={e.id}>
                    <Link
                      to={`/eventos/${e.id}`}
                      className="flex gap-4 rounded border border-border bg-card p-4 transition hover:border-gold"
                    >
                      <div className="flex h-14 w-14 flex-none flex-col items-center justify-center rounded border border-gold bg-primary text-primary-foreground">
                        <span className="text-[10px] uppercase">
                          {d.toLocaleDateString("pt-BR", { month: "short" })}
                        </span>
                        <span className="font-serif text-xl leading-none">{d.getDate()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-base text-foreground">{e.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {e.time} · {e.location}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>*/}
        </div>
      </section>

      {/* Rádio / Canal callouts */}
      {/*} <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2">
        <Link
          to="/radio"
          className="group flex items-center gap-6 rounded border border-border bg-card p-6 transition hover:border-gold"
        >
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full border border-gold bg-primary text-primary-foreground">
            <Radio className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-primary">Rádio da Paróquia</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Programação de oração, formação e música católica ao vivo.
            </p>
          </div>
        </Link>
        <Link
          to="/canal"
          className="group flex items-center gap-6 rounded border border-border bg-card p-6 transition hover:border-gold"
        >
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full border border-gold bg-primary text-primary-foreground">
            <Youtube className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-primary">Canal no YouTube</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Últimos vídeos, transmissões e playlists da nossa comunidade.
            </p>
          </div>
        </Link>
      </section>*/}
    </div>
  );
}

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-end justify-between border-b border-gold/40 pb-3">
      <h2 className="font-serif text-3xl text-primary">{title}</h2>
      <Link to={href} className="text-xs uppercase tracking-widest text-primary hover:underline">
        Ver todos
      </Link>
    </div>
  );
}
