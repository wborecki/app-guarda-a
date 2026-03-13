

## Plano: Auditoria e melhorias mobile na jornada do locatário (quem guarda)

Jornada completa: **Hero (busca)** → **SearchResults** → **SpaceDetails** → **Checkout** → **PaymentSuccess**

---

### Problemas identificados

1. **SearchResults — botão mapa/lista sem safe-area**: `bottom-6` fixo; em iPhones com home bar, o botão fica colado no indicador. Precisa de `safe-area-bottom`.

2. **SearchResults — search summary bar overflow**: No 375px, os chips de localização + volume + datas + "Editar" transbordam sem indicação visual de scroll.

3. **SpaceCard — carousel arrows invisíveis no touch**: `opacity-0 group-hover:opacity-100` nas setas do `CardCarousel` — no mobile nunca aparecem. Dots existem mas setas devem ser sempre visíveis.

4. **SpaceCard — mobile layout**: No mobile a foto tem `h-52` fixo e o conteúdo abaixo fica extenso. O preço e CTA ficam muito afastados da foto. Ajustar para altura menor no mobile.

5. **SpaceDetails — mobile sticky CTA sem safe-area**: `pb-24` no body e `bottom-0` no CTA, mas falta `safe-area-bottom` explícito na classe.

6. **SpaceDetails — reservation editor ausente no mobile**: O editor de volume/dias existe apenas na sidebar desktop (`hidden lg:block`). No mobile, o usuário não consegue ajustar volume nem dias antes de reservar.

7. **Checkout — right sidebar summary**: `lg:grid-cols-[1fr_360px]` — no mobile, o resumo aparece ABAIXO de tudo (após termos, pagamento). Difícil ver o preço total sem scroll extenso.

8. **Checkout — photo grid 3 cols no mobile**: `grid-cols-3 sm:grid-cols-4` está OK mas em 375px as fotos ficam minúsculas (≈105px). Considerar `grid-cols-2` em telas < 375px.

9. **Checkout — mobile sticky CTA**: Só aparece quando `verificationComplete` — antes disso o usuário não vê preço fixo. Mostrar resumo de preço mesmo antes (sem botão de pagar).

10. **PaymentSuccess — sem safe-area e links de ação pequenos**: Botões lado a lado ficam apertados no 375px. Layout OK mas pode melhorar com stack vertical no mobile.

---

### Melhorias planejadas

#### CardCarousel
- Tornar setas sempre visíveis no mobile: `opacity-100 sm:opacity-0 sm:group-hover:opacity-100`

#### SearchResults
- Botão mapa/lista: adicionar `bottom-[calc(1.5rem+env(safe-area-inset-bottom))]` ou classe `safe-area-bottom` com margin
- Garantir que a barra de resumo de busca tenha fade indicator em mobile

#### SpaceDetails
- Adicionar mini-editor de reserva no mobile (abaixo da seção de capacidade, antes da sticky CTA), com controles de volume e dias
- Adicionar classe `safe-area-bottom` ao sticky CTA

#### Checkout
- Mostrar resumo de preço compacto (mini-card) ACIMA dos forms no mobile (visível sem scroll)
- Sticky CTA: mostrar preço total mesmo antes de verificação completa (botão desabilitado com texto "Complete a verificação")
- Photo grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`
- Adicionar `safe-area-bottom` ao sticky CTA

#### PaymentSuccess
- Botões em stack vertical no mobile: `flex-col sm:flex-row`
- Adicionar padding horizontal seguro

---

### Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/components/guardaai/search/CardCarousel.tsx` | Setas sempre visíveis no touch |
| `src/pages/SearchResults.tsx` | Safe-area no botão mapa/lista |
| `src/pages/SpaceDetails.tsx` | Mini-editor mobile, safe-area CTA |
| `src/pages/Checkout.tsx` | Resumo de preço mobile no topo, sticky CTA sempre visível, photo grid responsivo, safe-area |
| `src/pages/PaymentSuccess.tsx` | Botões empilhados no mobile |

