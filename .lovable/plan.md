

# Revisao UX Completa -- Plano de Ajustes

## Problemas Identificados

### 1. Login Page -- Copy desatualizada
- **Arquivo**: `src/pages/Login.tsx` (linhas 158-164)
- O card "Guardar itens" usa icone `Package` e texto "Guardar itens" -- deveria ser "Guardar objetos ou veiculos" com icone `Warehouse` para manter consistencia com o reposicionamento
- Texto "Reservas, pagamentos e status." esta ok

### 2. Footer -- Tagline desatualizada
- **Arquivo**: `src/components/guardaai/Footer.tsx` (linhas 29-31 e 74-76)
- Tagline "O jeito mais barato de guardar suas coisas." -- precisa refletir veiculos tambem
- Sugestao: "Guarde objetos e veiculos por menos." ou "Marketplace de espacos para objetos e veiculos."

### 3. Login Page -- Signup subtitle parcialmente desatualizada
- **Arquivo**: `src/pages/Login.tsx` (linha 132)
- "Crie uma conta unica para guardar itens e anunciar espaco." -- "itens" deveria ser "objetos ou veiculos"

### 4. SmallBusiness component -- Nao esta sendo usado
- `src/components/guardaai/SmallBusiness.tsx` esta importado em nenhum lugar da Index page. Nao e um bug, mas e codigo morto. Pode ser removido ou ignorado.

### 5. HostLanding form (Step 1) -- Espacamento entre blocos
- **Arquivo**: `src/pages/HostLanding.tsx` (linhas 296-394)
- Os blocos de formulario dentro do Step 1 (`<div className={step === 1 ? "" : "hidden"}>`) nao tem `space-y-4` no wrapper -- os campos ficam colados uns nos outros
- O `space-y-4` esta no `<div className="p-5 space-y-4">` pai, mas o bloco interno nao herda esse espacamento corretamente porque o conteudo esta dentro de um unico `<div>` filho

### 6. SpaceCard -- Emoji icons no vehicleNames
- **Arquivo**: `src/components/guardaai/search/SpaceCard.tsx` (linha 46)
- `v!.icon` e um emoji string do `vehicleCategories`. Concatenar emoji + nome funciona mas pode parecer inconsistente com o resto do design que usa Lucide icons

### 7. Checkout page -- Ja importa `Car` icon (ok)
- Verificado que o checkout ja tem suporte visual para veiculos

### 8. SEO descriptions -- Verificadas e ok
- Index, QueroGuardar, HostLanding -- todas atualizadas com veiculos

---

## Plano de Implementacao

### Tarefa 1: Corrigir Login page
- Trocar `Package` por `Warehouse` no card "Guardar itens"
- Mudar titulo do card de "Guardar itens" para "Guardar objetos e veiculos"
- Atualizar subtitle do signup: "itens" -> "objetos ou veiculos"

### Tarefa 2: Atualizar Footer tagline
- Mudar de "O jeito mais barato de guardar suas coisas." para "Guarde objetos e veiculos por menos." (mobile e desktop)

### Tarefa 3: Corrigir espacamento do formulario HostLanding
- Adicionar `space-y-4` ao div interno do Step 1 para que os campos Location, Space Use, Space Type, Dimensions nao fiquem colados

### Tarefa 4: (Opcional) Limpeza de SmallBusiness.tsx
- Componente nao utilizado. Pode ser removido para manter o projeto limpo, ou ignorado.

---

Todas as outras paginas e componentes estao visualmente consistentes apos o reposicionamento. Copy, icones, badges, cards de resultados, SpaceDetails, FAQ, Pricing, HowItWorks, Differentials, UseCases, Testimonials, Security, ForHosts, FinalCTA, ContactSection e Header estao alinhados com o novo posicionamento de objetos + veiculos.

