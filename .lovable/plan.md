

## Reorganização Completa da Navegação do Header

### Situação Atual

O header mistura links âncora da one-page com rotas para páginas separadas, sem padrão claro. "Simulador" e "Anunciar espaço" aparecem duplicados. "Fale conosco" abre página separada quebrando o padrão. "Quero guardar" aponta para `#simulador` em vez de uma página própria.

### Nova Arquitetura

```text
┌─────────────────────────────────────────────────────────┐
│  [Logo]   Como funciona  Preços  Segurança  FAQ        │
│           Fale conosco                                  │
│                              [Quero guardar] [Anunciar] │
└─────────────────────────────────────────────────────────┘

Links cinza = âncoras da one-page (rolagem suave)
Botões destacados = páginas próprias dedicadas
```

### Mudanças Planejadas

**1. Header (`Header.tsx`)**
- Novo `navLinks` com apenas 5 itens âncora, na ordem das seções da homepage:
  - Como funciona → `#como-funciona`
  - Preços → `#precos`
  - Segurança → `#seguranca`
  - FAQ → `#faq`
  - Fale conosco → `#fale-conosco`
- Remover "Simulador" e "Anunciar espaço" dos links cinza (elimina duplicidades)
- Botão "Quero guardar" → `/quero-guardar` (página própria)
- Botão "Anunciar espaço" → `/anunciar` (já existe, sem âncora)
- Implementar rolagem suave via `scrollIntoView({ behavior: 'smooth' })` com handler dedicado, em vez de depender do browser nativo com `href="#xxx"`
- Quando fora da homepage, navegar para `/#secao` e depois scroll

**2. Homepage — Adicionar seção "Fale conosco" (`Index.tsx`)**
- Adicionar uma seção compacta com `id="fale-conosco"` na homepage, antes do FinalCTA
- Conteúdo: título "Fale conosco", texto curto, botão que leva para `/fale-conosco` (chat com IA)
- Assim o link do header rola até essa seção, e de lá o usuário acessa o chat se quiser

**3. Nova página "Quero guardar" (`src/pages/QueroGuardar.tsx`)**
- Página dedicada à jornada de quem quer armazenar itens
- Estrutura:
  - Header (existente)
  - Hero compacto com proposta de valor ("Guarde suas coisas por muito menos")
  - Simulador reaproveitado (importar componente `Simulator` existente)
  - Seção rápida "Como funciona" (versão resumida, 3 passos)
  - Diferenciais/confiança compactos
  - CTA final
  - Footer
- Rota: `/quero-guardar` em `App.tsx`

**4. Corrigir "Anunciar espaço"**
- O `Link to="/anunciar"` já leva para o topo da página (comportamento padrão do React Router)
- Verificar se não há `scrollTo` ou âncora interferindo no `HostLanding.tsx`

**5. Footer (`Footer.tsx`)**
- Atualizar "Fale conosco" para apontar para `#fale-conosco` (âncora da homepage) em vez de `/fale-conosco`
- Atualizar "Simulador" / "Guardar itens" para apontar para `/quero-guardar`
- Manter links de páginas dedicadas (termos, itens proibidos, anunciar)

**6. FinalCTA (`FinalCTA.tsx`)**
- Atualizar "Encontrar um espaço" para apontar para `/quero-guardar` em vez de `#simulador`

**7. Rota em `App.tsx`**
- Adicionar `/quero-guardar` → `QueroGuardar`
- Manter `/fale-conosco` e `/contato` funcionando (chat IA continua acessível)

### Seção "Fale conosco" na Homepage

Componente simples (`ContactSection.tsx`) com:
- `id="fale-conosco"`
- Título e texto curto
- Botão "Iniciar conversa" → `/fale-conosco`
- Visual clean, consistente com o restante

### Ordem Final dos Links no Header

Segue a ordem real das seções na homepage:
1. Como funciona
2. Preços
3. Segurança
4. FAQ
5. Fale conosco

### Arquivos Modificados
- `src/components/guardaai/Header.tsx` — nova lógica de navegação
- `src/pages/Index.tsx` — adicionar seção Fale conosco
- `src/components/guardaai/ContactSection.tsx` — novo componente
- `src/pages/QueroGuardar.tsx` — nova página
- `src/App.tsx` — nova rota
- `src/components/guardaai/Footer.tsx` — atualizar links
- `src/components/guardaai/FinalCTA.tsx` — atualizar destino do CTA

### O Que Não Muda
- Página de chat (`/fale-conosco`) continua existindo e funcional
- Página de anunciar (`/anunciar`) mantém conteúdo e formulário
- Autenticação, dashboard, checkout — intocados
- Componente Simulator reutilizado, não duplicado

