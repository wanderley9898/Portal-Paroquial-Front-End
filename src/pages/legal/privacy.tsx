import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

const LEGAL_VERSION = "2026-05-27";

export function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl text-foreground">
        Política de Privacidade
      </h1>
      <p className="mt-2 font-serif text-sm text-muted-foreground">
        Versão {LEGAL_VERSION} · Atualizado em 27/05/2026
      </p>

      <div className="mt-8 space-y-6 font-serif text-sm leading-7 text-foreground">
        <p>
          Esta política explica como tratamos dados pessoais para oferecer o
          LoreForge com segurança, autenticação e funcionamento da plataforma.
        </p>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            1. Dados coletados
          </h2>
          <p>
            Podemos coletar nome, email, telefone opcional, código de jogador,
            dados técnicos de sessão e conteúdos criados dentro da plataforma.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            2. Finalidades
          </h2>
          <p>
            Utilizamos os dados para autenticar contas, permitir uso das
            funcionalidades, prevenir abusos, manter segurança e melhorar o
            serviço.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            3. Compartilhamento
          </h2>
          <p>
            Nao vendemos dados pessoais. Pode haver compartilhamento com
            provedores de infraestrutura e serviços essenciais, sempre conforme
            necessidade operacional e obrigações legais.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            4. Retenção e segurança
          </h2>
          <p>
            Mantemos dados pelo período necessário para operação do serviço,
            cumprimento legal e defesa de direitos, adotando medidas técnicas e
            organizacionais de segurança.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            5. Direitos do titular
          </h2>
          <p>
            Voce pode solicitar confirmação de tratamento, acesso, correção,
            exclusão quando aplicável e informações sobre compartilhamento,
            observadas as bases legais vigentes.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded border border-border/60 bg-card/40 p-4 font-serif text-sm text-muted-foreground">
        Para entender identificadores de navegação, consulte a
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
