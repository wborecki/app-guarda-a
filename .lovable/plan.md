

## Busca principal no Hero da Homepage

### Situacao atual

O Hero atual tem headline + chips de destaque + dois botoes (um ancora para o simulador, outro link para anunciar). A busca real so acontece no Simulator, que fica bem abaixo na pagina. O usuario precisa scrollar para comecar.

O Neighbor usa uma abordagem oposta: a busca e o elemento central do hero, simples e direta.

### Plano

**1. Adicionar barra de busca rapida no Hero**

Inserir um bloco compacto de busca diretamente no Hero, acima dos botoes atuais. Formato horizontal no desktop (estilo "search bar" unica), empilhado no mobile:

```text
Desktop:
┌──────────────────────────────────────────────────────────────┐
│  📍 Onde quer guardar?  │  📅 Quando?  │  📦 Volume m³  │ Buscar │
└──────────────────────────────────────────────────────────────┘

Mobile:
┌────────────────────────┐
│ 📍 Onde quer guardar?  │
│ 📅 Quando? (range)     │
│ 📦 Volume estimado     │
│ [  Buscar espaços  ]   │
└────────────────────────┘
```

- Campo de localizacao: reutiliza `LocationAutocomplete` com visual compacto
- Campo de datas: reutiliza `DateRangePicker` com trigger compacto inline
- Campo de volume: input numerico simples com sufixo "m³" e placeholder "Ex: 2"
- Botao CTA: "Buscar espaços" com cor accent, destaque forte

Ao clicar "Buscar", navega direto para `/buscar` com os parametros (location, deliveryDate, pickupDate, totalVol).

**2. Reorganizar hierarquia do Hero**

- Manter headline e subtitulo (mais concisos)
- Remover ou reduzir os highlight chips no desktop para dar espaco a busca
- Manter os chips no mobile como prova social compacta abaixo da busca
- Trocar o botao "Quero guardar meus objetos" (ancora para simulador) pela barra de busca
- Manter o link "Quero anunciar meu espaço" como link secundario abaixo da busca
- Adicionar micro-link "Quer mais detalhe? Use nosso simulador completo" apontando para `#simulador`

**3. Manter Simulator intacto**

O Simulator continua existindo na pagina como ferramenta de calculo detalhado (itens por dimensao, tipo de espaco, uso, horarios). A busca do Hero e uma entrada rapida; o Simulator e a entrada detalhada. Sem remocao.

**4. Ajustes visuais**

- Barra de busca com fundo `bg-card/90 backdrop-blur`, borda sutil, sombra, `rounded-2xl`
- No desktop: campos inline com separadores visuais
- No mobile: campos empilhados em card
- CTA com `bg-accent` forte e animacao sutil

**5. Navegacao para resultados**

A busca rapida do Hero envia para `/buscar` com `state`: `{ location, deliveryDate, pickupDate, totalVol, days }`. O SearchResults ja aceita esses parametros via location state.

### Arquivos alterados

- `src/components/guardaai/Hero.tsx` - adicionar barra de busca, reorganizar layout
- `src/components/guardaai/DateRangePicker.tsx` - adicionar prop `compact` para trigger inline menor
- `src/pages/SearchResults.tsx` - aceitar `totalVol` direto do state (sem items) como fallback

### O que NAO muda

- Simulator completo permanece identico
- Fluxo existente simulator -> busca continua funcionando
- Filtros, ordenacao, mapa, checkout, auth - tudo preservado
- Logica de pricing inalterada

