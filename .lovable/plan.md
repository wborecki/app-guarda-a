

## Plano: Fotos demonstrativas, carrossel de imagens e página de detalhes do espaço

### 1. Fotos demonstrativas nos mock data (`SearchResults.tsx`)

Substituir `photo: "/placeholder.svg"` por um array `photos` com 4-5 URLs de imagens reais do Unsplash para cada espaço (garagens, quartos, depósitos, etc.). Exemplo:
```
photos: [
  "https://images.unsplash.com/photo-garage-1...",
  "https://images.unsplash.com/photo-garage-2...",
  ...
]
```

### 2. Carrossel de fotos nos cards (`SearchResults.tsx`)

Substituir a imagem estática por um carrossel usando `embla-carousel-react` (já instalado) na área de foto de cada card. Incluir indicadores de ponto e setas de navegação.

### 3. Nova página de detalhes do espaço (`src/pages/SpaceDetails.tsx`)

Página acessível via `/espaco/:id` com:
- **Galeria de fotos** grande no topo (carrossel ou grid)
- **Informações completas** do espaço (descrição, área, features, endereço)
- **Perfil do proprietário** (nome, foto, avaliação, tempo na plataforma, descrição)
- **Comentários/avaliações** mock (lista com nome, estrelas, data e texto)
- **Botão "Selecionar este espaço"** fixo no rodapé
- Preço total calculado baseado nos dias

### 4. Navegação entre páginas

- Cada card em `SearchResults.tsx` fica clicável (exceto o botão "Selecionar") e navega para `/espaco/:id` passando os dados do espaço + simulação via state
- Nova rota em `App.tsx`: `<Route path="/espaco/:id" element={<SpaceDetails />} />`

### Arquivos

1. **Editado**: `src/pages/SearchResults.tsx` — fotos Unsplash, carrossel nos cards, cards clicáveis
2. **Novo**: `src/pages/SpaceDetails.tsx` — página de detalhes com galeria, proprietário e comentários
3. **Editado**: `src/App.tsx` — rota `/espaco/:id`

