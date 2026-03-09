

## Gerar nova imagem de fundo com IA

A imagem atual mostra pessoas em frente a uma casa com caixas e objetos de mudança -- conceito adequado para o GuardaAí. Posso gerar uma imagem similar usando o modelo de geração de imagens com IA (Nano banana pro para maior qualidade).

### O que será feito

1. **Gerar uma nova imagem** via API `google/gemini-3-pro-image-preview` com um prompt descrevendo a mesma ideia: pessoas brasileiras em frente a uma casa residencial, com caixas de mudança, malas e objetos, em um cenário acolhedor e bem iluminado -- em alta resolução e qualidade fotográfica.

2. **Salvar a imagem** como um novo asset no projeto (formato PNG para melhor qualidade).

3. **Atualizar o Hero.tsx** para referenciar a nova imagem.

### Observação

A geração por IA pode não acertar de primeira -- posso ajustar o prompt se o resultado não ficar bom. Outra alternativa seria usar uma imagem de banco de imagens gratuito (Unsplash/Pexels) com URL direta, que teria qualidade fotográfica real garantida.

