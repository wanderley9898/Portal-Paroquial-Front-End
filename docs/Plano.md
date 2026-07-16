# Portal Web da Paróquia — Plano

Frontend completo (área pública + painel administrativo) com dados mock em memória. Backend NestJS pode ser integrado depois substituindo a camada de mock por chamadas HTTP.

## Estilo visual

- Direção: clássica e sóbria, sensação católica tradicional
- Paleta: bordô/vinho profundo (#5c2018), dourado envelhecido (#c9a84c), off-white (#f5f0e0), grafite (#1a1a1a)
- Tipografia: **Cormorant Garamond** (títulos, serifada) + **Inter** (corpo)
- Detalhes: molduras douradas discretas, cards com sombra suave, ícones lineares (lucide), sem gradientes chamativos

## Estrutura de rotas (TanStack Router)

### Área Pública

- `/` — Home: hero com missa em destaque, próximas missas, últimas notícias, transmissão ao vivo em destaque, botão rádio
- `/noticias` — Lista/filtro por categoria (NewsCategoryEnum) com paginação
- `/noticias/$id` — Detalhe da notícia
- `/eventos` — Agenda (visualização lista + calendário mensal)
- `/eventos/$id` — Detalhe do evento
- `/transmissoes` — Transmissões ao vivo (destaque, próximas, histórico)
- `/canal` — Canal YouTube da paróquia (último vídeo, playlists, inscrição)
- `/radio` — Player de rádio online (play/pause, volume, programação, programa atual)
- `/documentos` — Downloads (documentos e materiais)
- `/contato` — Canais oficiais, endereço, redes sociais
- `/sobre` — Sobre a paróquia

### Área Administrativa

- `/admin/login` — Login mock (sem backend real)
- `/admin` — Dashboard com métricas (nº notícias, eventos próximos, visualizações)
- `/admin/noticias` — CRUD notícias (lista, criar, editar, publicar/despublicar, destacar)
- `/admin/eventos` — CRUD eventos
- `/admin/transmissoes` — CRUD lives (URL YouTube, data programada, playlist)
- `/admin/radio` — Gerenciar programação da rádio
- `/admin/documentos` — Upload/gerenciar documentos
- `/admin/usuarios` — Gerenciar usuários e papéis (SUPER_ADMIN, ADMIN, SECRETARY, COMMUNICATION, EDITOR)

Área admin protegida por layout `_admin` com guarda simples baseada em contexto local.

## Modelos de dados (mock em memória)

Espelham o backend NestJS:

- **News**: id, title, subtitle, content, coverImage, category (14 categorias), featured, published, publishedAt, expiresAt, youtubeUrl, tags, views, author
- **Event**: id, nome, descrição, data, horário, local, responsável, categoria, imagem, visualizações
- **Broadcast**: id, título, youtubeUrl, scheduledAt, status (live/upcoming/past), thumbnail
- **RadioProgram**: id, nome, horário início/fim, dias da semana, apresentador
- **Document**: id, título, descrição, arquivo (URL), categoria, tamanho
- **User**: id, nome, email, role (RolesEnum)

Dados semeados em `src/lib/mock/*.ts` com ~15 notícias, ~10 eventos, ~5 transmissões, programação de rádio de exemplo.

## Detalhes técnicos

- **Estado**: TanStack Query com `queryFn` retornando dados dos módulos mock (assíncrono via `Promise.resolve`) — troca por `fetch` real depois
- **Persistência admin**: alterações no CRUD vão para `localStorage` (via zustand) para simular persistência entre navegações
- **Auth mock**: contexto de usuário simulado no `_authenticated` layout, com seleção de papel na tela de login
- **Design system**: tokens em `src/styles.css` (@theme) — cores bordô/dourado como `--color-primary`/`--color-accent`
- **Fontes**: `<link>` para Google Fonts (Cormorant Garamond + Inter) em `__root.tsx`
- **Calendário eventos**: componente `Calendar` do shadcn com destaques em dias com evento
- **Player rádio**: `<audio>` HTML5 com controles customizados
- **Player YouTube**: iframe embed simples
- **Componentes**: shadcn (Button, Card, Dialog, Table, Form, Tabs, Badge, Calendar, Sonner)
- **SEO**: `head()` por rota com título/description específicos

## Ordem de implementação

1. Design system (tokens, fontes, layout base com header/footer paroquial)
2. Home + mocks base
3. Notícias (lista + detalhe)
4. Eventos (lista + calendário + detalhe)
5. Transmissões + Canal
6. Rádio (player)
7. Documentos, Contato, Sobre
8. Admin: login mock + layout + dashboard
9. Admin: CRUDs (notícias, eventos, transmissões, rádio, documentos, usuários)

## Fora de escopo (agora)

- Integração real com API NestJS (fica preparado para plugar depois)
- Autenticação real / JWT
- Upload real de arquivos
- Integração YouTube Data API (usa links manuais e embeds)
- Streaming real da rádio (usa URL de stream configurável)
