

# Melhorar botoes de voltar e navegacao do site

## Problemas identificados

1. **Inconsistencia nos botoes de voltar** -- cada pagina implementa seu proprio botao com estilo e comportamento diferente:
   - TermsHost, TermsRenter, ProhibitedItems, Contact: `Button variant="ghost"` com texto "Voltar"
   - SpaceDetails, Checkout: `Button variant="ghost" size="icon"` (so icone, sem texto)
   - SpaceOnboarding: `Button variant="outline"` com "Voltar" (navegacao entre steps)
   - AdminLayout: `Button variant="outline"` com "Voltar ao site"

2. **Nomenclaturas genericas** -- "Voltar" nao indica para onde o usuario vai voltar, gerando inseguranca na navegacao

3. **Fallback inconsistente** -- `window.history.length > 1 ? navigate(-1) : navigate("/")` pode levar o usuario para fora do site se ele entrou direto na pagina

4. **Paginas sem botao de voltar** -- QueroGuardar, Login, SearchResults nao tem botao de retorno

## Plano de implementacao

### 1. Criar componente reutilizavel `BackButton`

Criar `src/components/guardaai/BackButton.tsx` que padroniza:
- Estilo: `variant="ghost"`, tamanho `sm`, icone `ChevronLeft` (mais moderno que `ArrowLeft`), cor `text-muted-foreground hover:text-foreground`
- Recebe prop `label` (ex: "Resultados", "Inicio") e `fallbackTo` (rota de fallback)
- Logica: se `window.history.length > 2` usa `navigate(-1)`, senao vai para `fallbackTo`
- Animacao sutil no hover (icone desliza para esquerda)

### 2. Aplicar em todas as paginas

| Pagina | Label atual | Novo label | Fallback |
|---|---|---|---|
| SpaceDetails | (so icone) | "Resultados" | `/buscar` |
| Checkout | (so icone) | "Detalhes do espaco" | `/buscar` |
| TermsHost | "Voltar" | "Pagina anterior" | `/` |
| TermsRenter | "Voltar" | "Pagina anterior" | `/` |
| ProhibitedItems | "Voltar" | "Pagina anterior" | `/` |
| Contact | "Voltar" | "Inicio" | `/` |
| SearchResults | (nenhum) | "Inicio" | `/` |
| Login | (nenhum) | "Inicio" | `/` |
| QueroGuardar | (nenhum) | "Inicio" | `/` |

### 3. Melhorar o botao do Checkout apos confirmar pagamento

- "Voltar ao inicio" -> "Ir para o inicio"
- "Voltar para editar reserva" -> "Editar reserva" (mais limpo)

### 4. SpaceOnboarding (steps internos)

- Manter `variant="outline"` para navegacao entre steps (e diferente do back global)
- Texto "Voltar" -> "Etapa anterior"

### 5. AdminLayout

- "Voltar ao site" esta bom, manter

### Arquivos modificados

- **Novo**: `src/components/guardaai/BackButton.tsx`
- **Editados**: `SpaceDetails.tsx`, `Checkout.tsx`, `TermsHost.tsx`, `TermsRenter.tsx`, `ProhibitedItems.tsx`, `Contact.tsx`, `SearchResults.tsx`, `Login.tsx`, `QueroGuardar.tsx`, `SpaceOnboarding.tsx`

