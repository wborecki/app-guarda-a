

## Autocomplete de localização no Simulador

Sim, é possível! A melhor opção gratuita é a **API de Autocomplete do OpenStreetMap (Nominatim)** -- totalmente gratuita, sem necessidade de chave de API, e cobre todo o Brasil.

### Como vai funcionar

1. O campo "Cidade ou bairro" será transformado em um input com **dropdown de sugestões** que aparece conforme o usuário digita.
2. Ao digitar 3+ caracteres, uma busca é feita ao Nominatim (com debounce de 300ms para não sobrecarregar).
3. As sugestões aparecem em um dropdown estilizado abaixo do input, mostrando nome do local com ícone de mapa.
4. Ao clicar numa sugestão, o valor é preenchido automaticamente.

### Detalhes técnicos

- **API**: `https://nominatim.openstreetmap.org/search?q={query}&format=json&countrycodes=br&limit=5`
- Sem chave de API necessária, apenas respeitar rate limit (1 req/seg -- o debounce já resolve).
- Criar um componente `LocationAutocomplete` reutilizável com estado interno para sugestões.
- Usar `useRef` + click outside para fechar o dropdown.
- Filtrar resultados para Brasil (`countrycodes=br`).

### Arquivos modificados

1. **Novo**: `src/components/guardaai/LocationAutocomplete.tsx` -- componente de input com autocomplete
2. **Editado**: `src/components/guardaai/Simulator.tsx` -- substituir o Input de localização pelo novo componente

