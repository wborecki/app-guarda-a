

## Plano: Remover campo "Bairro" do formulário de anunciar espaço

Mudança simples em `src/pages/HostLanding.tsx`:

1. **Remover `neighborhood`** do estado inicial do formulário (linha 71)
2. **Remover o campo Input** de "Bairro (opcional)" (linhas 364-369)
3. **Remover `Bairro: ${form.neighborhood}`** da mensagem do WhatsApp (linha 99)

Nenhuma outra dependência encontrada. O campo de localização com autocomplete já cobre essa informação.

