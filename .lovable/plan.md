

## Plano: Campo de dias customizado + Página de resultados de busca

### Resumo

Duas mudanças principais:

1. **Simulador**: Substituir o select de período por um campo numérico de "Quantos dias?" para permitir qualquer número específico. Adicionar campos de data/hora de entrega e retirada. Após simular, mostrar botão "Encontrar espaço" que leva à página de resultados.

2. **Nova página `/buscar`**: Exibe lista de espaços disponíveis próximos (dados mock por enquanto), com foto, dados do proprietário, preço, distância e botão para avançar na contratação.

### Alterações no Simulador (`Simulator.tsx`)

- Remover o `Select` de período (diário/semanal/mensal/etc.)
- Adicionar campo numérico `Input` para "Quantos dias?" (mínimo 1)
- Adicionar 2 campos de data+hora: "Data e hora de entrega" e "Data e hora de retirada" usando DatePicker + input de hora
- Recalcular preço usando o número de dias informado
- No resultado da simulação, adicionar botão "Encontrar espaço disponível" que navega para `/buscar` passando os dados via query params ou state do React Router

### Nova página de resultados (`src/pages/SearchResults.tsx`)

- Recebe os dados da simulação (itens, localização, dias, datas, área, volume)
- Exibe resumo da busca no topo (área necessária, período, localização)
- Lista de espaços disponíveis (dados mock com ~5 opções) contendo:
  - Foto do local (placeholder)
  - Nome do proprietário e avaliação
  - Tipo de espaço, endereço, distância
  - Preço por dia e preço total
  - Botão "Selecionar este espaço"
- Ao clicar em selecionar, futuramente levará ao fluxo de contratação (por enquanto pode mostrar um toast de "em breve")

### Nova rota no `App.tsx`

- Adicionar `<Route path="/buscar" element={<SearchResults />} />`

### Arquivos

1. **Editado**: `src/components/guardaai/Simulator.tsx` — campo de dias numérico, campos de data/hora, botão "Encontrar espaço"
2. **Novo**: `src/pages/SearchResults.tsx` — página de resultados com lista de espaços mock
3. **Editado**: `src/App.tsx` — nova rota `/buscar`

