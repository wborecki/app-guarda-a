

## Plano: Melhorar campo de localização com GPS e renomear

### Alterações

**1. Renomear o campo** de "Cidade ou bairro" para **"Seu endereço"** com placeholder "Ex: Rua Augusta, 1200, São Paulo" — faz mais sentido para encontrar espaços próximos.

**2. Adicionar botão "Usar minha localização"** no `LocationAutocomplete`:
- Botão com ícone de GPS (Crosshair/LocateFixed do Lucide) ao lado do input
- Ao clicar, usa `navigator.geolocation.getCurrentPosition()` para obter lat/lng
- Faz reverse geocoding via Nominatim: `GET https://nominatim.openstreetmap.org/reverse?lat=X&lon=Y&format=json&accept-language=pt-BR`
- Preenche o campo com o endereço retornado
- Mostra loading enquanto busca e trata erro (permissão negada, etc.)

### Arquivos

1. **Editado**: `src/components/guardaai/LocationAutocomplete.tsx`
   - Adicionar botão de GPS com ícone `LocateFixed` posicionado à direita do input
   - Implementar `handleGeolocate()` com `navigator.geolocation` + reverse geocoding Nominatim
   - Estados de loading/erro para o GPS

2. **Editado**: `src/components/guardaai/Simulator.tsx`
   - Renomear label para "Seu endereço"
   - Atualizar placeholder para "Ex: Rua Augusta, 1200, São Paulo"

