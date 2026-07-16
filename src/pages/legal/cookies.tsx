const LEGAL_VERSION = "2026-05-27";

export function CookiesPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl text-foreground">
        Política de Cookies
      </h1>
      <p className="mt-2 font-serif text-sm text-muted-foreground">
        Versão {LEGAL_VERSION} · Atualizado em 27/05/2026
      </p>

      <div className="mt-8 space-y-6 font-serif text-sm leading-7 text-foreground">
        <p>
          Cookies e tecnologias similares sao usados para manter sua sessão,
          lembrar preferencias e apoiar segurança e desempenho da plataforma.
        </p>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            1. Cookies estritamente necessários
          </h2>
          <p>
            Essenciais para login, autenticação, proteção contra uso indevido e
            funcionamento básico da aplicação.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            2. Cookies funcionais
          </h2>
          <p>
            Permitem lembrar configurações e preferências de uso para melhorar a
            experiência de navegação.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            3. Gerenciamento
          </h2>
          <p>
            Voce pode controlar cookies no navegador. A desativação de cookies
            essenciais pode impactar funcionalidades de autenticação e uso da
            plataforma.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs uppercase tracking-wider text-gold/80">
            4. Atualizações
          </h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças técnicas,
            legais ou operacionais.
          </p>
        </div>
      </div>
    </section>
  );
}
