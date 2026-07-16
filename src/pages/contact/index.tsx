import { CONTACT_EMAIL } from "@/constants/envs";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

export function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl text-foreground">Contato</h1>
      <p className="mt-3 max-w-2xl font-serif text-base text-muted-foreground">
        Fale com a equipe do LoreForge para dúvidas, parcerias e suporte geral. Você também pode
        entrar na comunidade para jogar, trocar ideias e reportar problemas.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="rounded border border-border/60 bg-card/40 p-6">
          <h2 className="font-display text-2xl text-foreground">Discord da comunidade</h2>
          <p className="mt-2 font-serif text-sm leading-6 text-muted-foreground">
            Entre no servidor oficial para encontrar mesas, conversar com outros jogadores e
            reportar bugs diretamente para o time.
          </p>
        </article>

        <article className="rounded border border-border/60 bg-card/40 p-6">
          <h2 className="font-display text-2xl text-foreground">E-mail</h2>
          <p className="mt-2 font-serif text-sm leading-6 text-muted-foreground">
            Para contato institucional, privacidade, comercial ou solicitações formais, envie uma
            mensagem para o e-mail abaixo.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-block font-sans text-sm font-semibold text-gold hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </article>
      </div>

      <div className="mt-8 rounded border border-border/60 bg-card/30 p-4 font-serif text-sm text-muted-foreground">
        Consulte também nossos
        <Link to={ROUTES.public.terms} className="mx-1 text-gold hover:underline">
          Termos de Uso
        </Link>
        e
        <Link to={ROUTES.public.privacy} className="mx-1 text-gold hover:underline">
          Política de Privacidade
        </Link>
        .
      </div>
    </section>
  );
}
