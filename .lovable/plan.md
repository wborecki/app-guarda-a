

## Redesign Conjunto: "Quero Guardar" e "Anunciar Espaço"

### Diagnóstico

**Layout**: QueroGuardar usa layout centrado/empilhado (hero → simulador → seções). HostLanding usa layout side-by-side (value prop esquerda + form direita). As duas páginas não parecem do mesmo produto.

**Copy com problemas no HostLanding**:
- "Ganhe até R$45/m³ por mês" — R$45 é o preço bruto cobrado do cliente por 30 dias. Não é o que o anfitrião recebe líquido (há comissão da plataforma). Promessa enganosa.
- Cards de ganhos (R$135, R$225, R$450) apresentam valores como se fossem garantidos, sem mencionar ocupação variável ou comissão.
- FAQ diz "O valor base é de R$45/m³ por mês" — impreciso, pois é o teto da tabela progressiva.
- "Preencha os dados e comece a ganhar" — promessa instantânea irreal.

**Copy com problemas no QueroGuardar**:
- "Até 60% mais barato que self storage" — inconsistente com homepage que diz "até 70%". Padronizar.
- Benefício repete "até 60%" novamente.

### Plano

**1. Redesenhar QueroGuardar com layout side-by-side**
- Esquerda: hero com proposta de valor, 3 benefícios compactos, mini-cards de preço (tabela progressiva real)
- Direita: Simulador compacto (reutilizar componente existente, mas encapsulado num card com sombra igual ao form do HostLanding)
- Abaixo: Como funciona (3 steps) → Segurança → FAQ → CTA final
- Mesma estrutura visual do HostLanding: grid `lg:grid-cols-[1fr_420px]`, mesmos blobs decorativos, mesmo chip no topo

**2. Corrigir copy de valores no HostLanding**
- Hero: trocar "comece a ganhar até R$45/m³ por mês" → "Cadastre seu espaço e receba por cada reserva"
- Benefits: trocar "Ganhe até R$45/m³ por mês com espaço ocioso" → "Receba por cada m³ reservado no seu espaço"
- Cards de ganhos: adicionar "Estimativa bruta*" como label, trocar "até R$X/mês" por faixa, nota de rodapé: "Valores brutos estimados com ocupação total a R$45/m³. Rendimento real depende da demanda e da comissão da plataforma."
- FAQ "Como o valor é calculado?": "O preço cobrado do cliente segue uma tabela progressiva de R$5 (1 dia) a R$45 (30 dias) por m³. Seu ganho é calculado sobre esse valor."
- Subtítulo do form: "Preencha os dados e comece a ganhar" → "Preencha os dados para cadastrar seu espaço"

**3. Padronizar copy do QueroGuardar**
- Usar "Pague muito menos que um self storage tradicional" (sem porcentagem específica no hero, alinhado com diretriz editorial)
- Benefício: trocar "Até 60% mais barato" → "Muito mais acessível que self storage"

**4. Padronizar seções das duas páginas**
Ambas seguirão a mesma sequência:
1. Hero + formulário/ação (side-by-side)
2. Tipos aceitos / Como funciona (3 cards compactos)
3. Segurança (grid de cards)
4. FAQ (accordion)
5. CTA final

Mesmos paddings (`py-14 md:py-20`), mesmos backgrounds alternados (`bg-secondary/40`), mesma tipografia de títulos.

**5. Refinar cards de ganhos do HostLanding**
- Números maiores (`text-lg font-bold`) para melhor impacto visual
- Label "Estimativa bruta" em badge sutil
- Nota de rodapé mais visível

**6. Chip de identidade no topo de cada página**
- QueroGuardar: chip "Para quem quer guardar" com ícone Package
- HostLanding: chip "Para anfitriões" com ícone Home (já existe)

### Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `src/pages/QueroGuardar.tsx` | Redesign completo: layout side-by-side, simulador à direita, copy corrigida |
| `src/pages/HostLanding.tsx` | Correção de copy de valores, refinamento dos cards de ganhos, ajuste FAQ |

### O Que Não Muda
- Componente Simulator (reutilizado)
- Formulário de cadastro de espaço (funcionalidade preservada)
- Header, footer, rotas, autenticação
- Lógica de pricing em `pricing.ts`

