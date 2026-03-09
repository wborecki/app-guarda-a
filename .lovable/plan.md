

## Estimativa de dimensões por item no Simulador

### Sobre APIs de dimensões de produtos

Infelizmente, **não existe uma API pública gratuita** que forneça dimensões (A x L x C) de produtos por nome/marca de forma confiável. As opções existentes são pagas ou limitadas (Amazon Product API, Google Shopping API, etc.) e exigem credenciais comerciais.

### Solução proposta: Base local + entrada manual

A melhor abordagem é combinar uma **base de dados local com dimensões típicas** de itens comuns + possibilidade de entrada manual:

1. **Campo de busca de itens**: Input com autocomplete que busca numa base local de ~50+ itens comuns (geladeira Brastemp Frost Free, sofá 3 lugares, cama queen, TV 55", etc.) com dimensões pré-cadastradas (altura x largura x comprimento em cm).

2. **Entrada manual**: Botão "Informar dimensões manualmente" que expande 3 campos (altura, largura, comprimento em cm) para itens não encontrados na base.

3. **Lista de itens múltiplos**: Permitir adicionar vários itens, cada um com suas dimensões, e calcular a área/volume total.

4. **Cálculo automático**: A partir das dimensões, calcular área de piso (L x C) e volume (A x L x C), somando todos os itens para dar o total em m².

### Estrutura dos dados da base local

```text
{ nome: "Geladeira Brastemp Frost Free 375L", categoria: "Eletrodomésticos",
  altura: 180, largura: 60, comprimento: 65 }
{ nome: "Sofá 3 lugares", categoria: "Móveis",
  altura: 85, largura: 200, comprimento: 90 }
{ nome: "Cama Queen", categoria: "Móveis",
  altura: 45, largura: 158, comprimento: 198 }
...
```

### Arquivos

1. **Novo**: `src/data/itemDimensions.ts` — base de dados com ~50 itens comuns categorizados (Móveis, Eletrodomésticos, Eletrônicos, Caixas, Esporte, Veículos)
2. **Novo**: `src/components/guardaai/ItemDimensionInput.tsx` — componente com autocomplete de itens, campos manuais de dimensão, e lista de itens adicionados
3. **Editado**: `src/components/guardaai/Simulator.tsx` — substituir o select atual de objetos pelo novo sistema de itens com dimensões, recalcular área/volume a partir das dimensões reais

### Fluxo do usuário

1. Digita "geladeira" → aparece lista: "Geladeira Brastemp 375L", "Geladeira Consul 340L", etc.
2. Seleciona → dimensões preenchidas automaticamente (180 x 60 x 65 cm) — editáveis
3. Clica "Adicionar item" → item vai para lista
4. Pode adicionar mais itens ou clicar "Informar dimensões manualmente"
5. Total de área/volume é calculado em tempo real

