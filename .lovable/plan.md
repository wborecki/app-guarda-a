

## Problema encontrado

Vários botões no dashboard do cliente apontam para `/` (homepage) em vez de `/buscar` (página de busca). Quando o usuário clica em "Buscar espaço" ou "Encontrar espaço", ele é levado à homepage ao invés da busca.

### Links incorretos identificados

| Arquivo | Botão | Link atual | Link correto |
|---------|-------|------------|--------------|
| `DashboardOverview.tsx` (linha 139) | "Encontrar espaço" (ação rápida) | `/` | `/buscar` |
| `DashboardOverview.tsx` (linha 179) | "Buscar espaço" (atividade recente) | `/` | `/buscar` |
| `DashboardReservas.tsx` (linhas 26, 38) | "Buscar espaço" (empty states ativas/futuras) | `/` | `/buscar` |
| `DashboardAgenda.tsx` (linha 17) | "Buscar espaço" (empty state) | `/` | `/buscar` |
| `DashboardMensagens.tsx` (linha 16) | "Buscar espaço" (empty state) | `/` | `/buscar` |

### Plano

Trocar todos os `href="/"` por `href="/buscar"` nos botões que dizem "Buscar espaço" ou "Encontrar espaço" nos 4 arquivos acima.

Todos os outros links do dashboard (sidebar, ações rápidas para "Anunciar", "Minhas reservas", "Financeiro", etc.) estão corretos.

