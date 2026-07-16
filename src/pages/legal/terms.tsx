import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

const LEGAL_VERSION = "2026-05-27";

export function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl text-foreground">Termos de Uso</h1>
      <p className="mt-2 font-serif text-sm text-muted-foreground">
        Versão {LEGAL_VERSION} · Atualizado em 27/05/2026
      </p>

      <div className="mt-8 space-y-6 font-serif text-sm leading-7 text-foreground">
        <p>
          Ao criar conta e utilizar o LoreForge, voce concorda com estes Termos
          de Uso, com a Política de Privacidade e com a Política de Cookies.
        </p>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            1. Conta e acesso
          </h2>
          <p>
            Voce deve fornecer dados verdadeiros no cadastro e manter a
            confidencialidade da sua senha. A conta e pessoal e intransferível.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            2. Conteúdo do usuário
          </h2>
          <p>
            O conteúdo criado por voce permanece de sua autoria. Ao publicar na
            plataforma, voce concede licença nao exclusiva para hospedagem,
            exibição e operação técnica do serviço.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            3. Condutas proibidas
          </h2>
          <p>
            E proibido utilizar o serviço para atividades ilegais, fraude,
            violação de direitos autorais, distribuição de malware ou tentativa
            de acesso não autorizado.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            4. Suspensão e encerramento
          </h2>
          <p>
            Podemos suspender ou encerrar contas em caso de violação destes
            termos, mediante análise e, quando cabível, comunicação previa.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            5. Atualizações
          </h2>
          <p>
            Estes termos podem ser atualizados periodicamente. Mudanças
            relevantes serão informadas na plataforma.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded border border-border/60 bg-card/40 p-4 font-serif text-sm text-muted-foreground">
        Ao continuar, consulte também a
        <Link
          to={ROUTES.public.privacy}
          className="mx-1 text-gold hover:underline"
        >
          Política de Privacidade
        </Link>
        e a
        <Link
          to={ROUTES.public.cookies}
          className="mx-1 text-gold hover:underline"
        >
          Política de Cookies
        </Link>
        .
      </div>
    </section>
  );
}
