

## Revisão Completa de Design, UX e Coerência Visual — GuardaAí

### Diagnóstico

Após análise de todos os componentes, as principais inconsistências são:

1. **Paddings verticais inconsistentes** — seções variam entre `py-16 md:py-28`, `py-16 md:py-32`, `py-16 md:py-24` sem padrão
2. **Hero com link "Simulador ↓" apontando para `#simulador`** — deveria apontar para `/quero-guardar`
3. **SmallBusiness CTA** aponta para `#simulador` — deveria ir para `/quero-guardar`
4. **Homepage longa demais** — 12 seções + hero; UseCases, SmallBusiness e ForHosts têm sobreposição de conteúdo
5. **Seção Security** usa emojis (🔒, 🏠) — inconsistente com o restante
6. **Footer** tem duplicidades ("Quero guardar" + "Guardar itens", "Anunciar espaço" em dois blocos)
7. **QueroGuardar** é muito esparsa — hero + simulador + 3 steps + 4 benefits é pouco para uma landing de conversão
8. **HostLanding** já está razoável, mas o form poderia ter visual mais refinado

### Plano de Mudanças

**1. Padronizar espaçamentos verticais (Design System)**
- Definir padrão: `py-14 md:py-20` para seções regulares, `py-16 md:py-24` para seções maiores
- Aplicar em: HowItWorks, Differentials, Security, UseCases, SmallBusiness, ForHosts, Testimonials, FAQ, ContactSection, FinalCTA, Simulator

**2. Condensar a Homepage — remover 2 seções redundantes**
- Remover `SmallBusiness` (já coberto por UseCases + ForHosts)
- Mover conteúdo de negócios para dentro de `UseCases` como sub-seção
- Remover `Simulator` da homepage (agora vive em `/quero-guardar`)
- Resultado: Hero → HowItWorks → Differentials → Pricing → Security → UseCases → ForHosts → Testimonials → FAQ → ContactSection → FinalCTA

**3. Corrigir links órfãos no Hero**
- "Precisa calcular em detalhe? Use o simulador ↓" → `/quero-guardar`
- "Simulador detalhado ↓" (mobile) → `/quero-guardar`

**4. Corrigir SmallBusiness CTA**
- Se mantido parcialmente dentro de UseCases, CTA aponta para `/quero-guardar`

**5. Refinar Security — remover emojis, usar ícones**
- Substituir 🔒 e 🏠 por componentes com ícones Lock e Home
- Reduzir `py-16 md:py-32` para `py-14 md:py-20`

**6. Limpar Footer**
- Remover "Guardar itens" (duplica "Quero guardar")
- Reorganizar: coluna "Para você" + "Institucional" + "Sua conta" sem repetições

**7. Melhorar QueroGuardar**
- Adicionar barra de busca rápida no hero (reusar componente do Hero)
- Adicionar seção de confiança/segurança compacta
- Adicionar FAQ resumido (3-4 perguntas)
- Adicionar CTA final

**8. Refinar HostLanding form**
- Sombra mais sutil no form card
- Labels com `text-[11px]` consistente
- Upload area mais compacta
- Bordas e paddings mais uniformes

**9. Mobile refinements**
- Hero mobile: garantir que links secundários apontem corretamente
- Header mobile: gap entre botões CTA mais uniforme
- Cards em seções: garantir `gap-3` consistente no mobile

**10. FinalCTA**
- Reduzir `py-20 md:py-36` para `py-16 md:py-24` — menos espaço vazio

### Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `src/pages/Index.tsx` | Remover Simulator e SmallBusiness |
| `src/components/guardaai/Hero.tsx` | Links "simulador" → `/quero-guardar` |
| `src/components/guardaai/HowItWorks.tsx` | Padronizar padding |
| `src/components/guardaai/Differentials.tsx` | Padronizar padding |
| `src/components/guardaai/Pricing.tsx` | Padronizar padding |
| `src/components/guardaai/Security.tsx` | Remover emojis, padronizar padding |
| `src/components/guardaai/UseCases.tsx` | Absorver menção a negócios, padronizar padding |
| `src/components/guardaai/ForHosts.tsx` | Padronizar padding |
| `src/components/guardaai/Testimonials.tsx` | Padronizar padding |
| `src/components/guardaai/FAQ.tsx` | Padronizar padding |
| `src/components/guardaai/ContactSection.tsx` | Padronizar padding |
| `src/components/guardaai/FinalCTA.tsx` | Reduzir padding |
| `src/components/guardaai/Footer.tsx` | Remover duplicidades |
| `src/pages/QueroGuardar.tsx` | Adicionar busca, FAQ, confiança, CTA |
| `src/pages/HostLanding.tsx` | Refinar form visual |

### O Que Não Muda

- Rotas, autenticação, dashboard, checkout, SearchResults, SpaceDetails
- Lógica de navegação do header (já correta)
- Componente Simulator (preservado, apenas removido da homepage)
- Página de chat/fale conosco

