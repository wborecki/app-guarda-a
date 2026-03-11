

## Refinamento do Hero — Composicao e Proporcao

### Diagnostico

O card de busca desktop tem `p-4` externo + `px-5 py-4` em cada campo, criando altura excessiva. Os gaps entre blocos (`mb-7`, `mb-6`, `mb-12`, `mb-10`) estao desproporcionais — o espaco antes do card e maior que o necessario, e depois dele tambem. O conjunto nao tem ritmo coeso.

### Plano de alteracoes (apenas `Hero.tsx`)

**1. Compactar o card de busca (desktop)**
- Reduzir padding externo: `p-4` → `p-2.5`
- Reduzir padding dos campos: `px-5 py-4` → `px-4 py-3`
- Reduzir altura do input: `h-10` → `h-9`
- Reduzir altura do botao: `h-[52px]` → `h-[44px]`
- Dividers: `my-4` → `my-3`
- Resultado: card visivelmente mais fino e elegante, sem perder legibilidade

**2. Reequilibrar espacamentos verticais do bloco esquerdo**
- Badge → Titulo: `mb-7` → `mb-5`
- Titulo → Subtitulo: `mb-6` → `mb-4`
- Subtitulo → Card: `mb-12` → `mb-8`
- Card → Secondary CTA: `mb-10` → `mb-6`

Hierarquia: gaps moderados e consistentes, com o maior antes do card (ponto focal) mas sem exagero.

**3. Refinar CTA secundario**
- Reduzir gap entre botao e link: `gap-5` → `gap-4`
- Manter alinhamento atual

**4. Ajustar proporcao geral**
- Container interno: `md:py-24` → `md:py-20` para centrar melhor verticalmente
- Manter `max-w-[720px]` do bloco

**5. Mobile**
- Reduzir `p-4` do card mobile para `p-3.5`
- Manter estrutura empilhada intacta

### Nao altera
- Overlays/fades
- Logica de busca
- Campos e navegacao
- Responsividade existente
- LocationAutocomplete/DateRangePicker

