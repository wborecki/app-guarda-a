

## Plano: Auditoria e melhorias mobile na jornada do anfitrião

A jornada completa do anfitrião passa por: **HostLanding** (`/anunciar`) -> **Login** (`/entrar`) -> **SpaceOnboarding** (`/anunciar/finalizar`) -> **DashboardEspacos** (`/minha-conta/espacos`). Identifiquei os seguintes problemas e melhorias necessárias.

---

### Problemas identificados

1. **HostLanding - Step 2 do formulário**: Os selects de "Horário de acesso" e "Tipo de acesso" em `grid-cols-2` ficam apertados no mobile 375px, com textos truncados nos triggers do Select.

2. **HostLanding - Grid de earnings**: `grid-cols-3` no mobile faz os cards de estimativa ficarem muito estreitos (especialmente no 375px).

3. **HostLanding - Botão de remoção de fotos**: Usa `opacity-0 group-hover:opacity-100` que no mobile (touch) nunca aparece. Precisa ser sempre visível no mobile.

4. **SpaceOnboarding - Step tabs**: A barra de tabs com 6 itens transborda no mobile. Já usa overflow-x-auto mas os itens ficam muito comprimidos.

5. **StepDisponibilidade - Horários por dia**: A grade de switches + time inputs (7 linhas) fica muito apertada no mobile. Os inputs `w-24` somam ~200px + switch + label, estourando em 375px.

6. **StepDisponibilidade - Pricing suggestion text**: O texto "Sugestão: R$ 5,00/m³/dia (1 dia) · R$ 2,71 (7 dias) · R$ 1,50 (30 dias)" ao lado do input é muito longo para mobile.

7. **StepFotos - Botão de remoção**: Mesmo problema do HostLanding — `opacity-0 group-hover:opacity-100` não funciona no touch.

8. **StepRevisao - Grid summary**: `grid-cols-2` com muitos itens pode ficar apertado em 375px.

9. **DashboardEspacos - SpaceCard**: O layout `flex gap-4` com thumbnail + info + botões fica apertado no mobile. Botões "Continuar/Editar" e DropdownMenu se sobrepõem.

10. **DashboardEspacos - SuggestedPricingTable**: O `ml-24` no container da tabela de preços sugerida não faz sentido no mobile e empurra o conteúdo.

11. **Console warning**: `Footer` não aceita ref (Function component cannot be given refs). Não é um bug visual mas precisa ser limpo.

---

### Melhorias planejadas

#### HostLanding (`/anunciar`)
- Tornar earnings grid `grid-cols-3` responsivo (manter 3 mas reduzir padding no mobile)
- Step 2: mudar selects de acesso para `grid-cols-1` no mobile
- Botão de remoção de fotos: sempre visível no mobile (`opacity-100 md:opacity-0 md:group-hover:opacity-100`)

#### SpaceOnboarding (`/anunciar/finalizar`)
- Melhorar tabs: usar scroll snap e garantir tamanho mínimo legível
- Garantir que bottom navigation tenha safe-area padding

#### StepDisponibilidade
- Horários por dia: layout vertical no mobile (switch+label em uma linha, time inputs na linha seguinte)
- Texto de sugestão de preço: quebrar em linhas no mobile em vez de inline

#### StepFotos
- Botão de remoção: sempre visível no touch (mesma correção do HostLanding)

#### StepRevisao
- Garantir que grid summary use `grid-cols-1` no mobile < 375px

#### DashboardEspacos
- SpaceCard: layout empilhado no mobile (thumbnail full-width, info abaixo, botões em row)
- Remover `ml-24` no SuggestedPricingTable para mobile

#### Footer
- Adicionar `React.forwardRef` ao Footer para eliminar o console warning

---

### Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/pages/HostLanding.tsx` | Responsividade Step 2, earnings grid, foto removal buttons |
| `src/pages/SpaceOnboarding.tsx` | Tabs scroll, bottom nav safe area |
| `src/components/guardaai/onboarding/StepDisponibilidade.tsx` | Layout horários mobile, pricing suggestion text |
| `src/components/guardaai/onboarding/StepFotos.tsx` | Botão remoção touch-friendly |
| `src/components/guardaai/onboarding/StepRevisao.tsx` | Grid summary responsivo |
| `src/pages/dashboard/DashboardEspacos.tsx` | SpaceCard mobile layout, pricing table margin |
| `src/components/guardaai/Footer.tsx` | forwardRef wrapper |

