
Diagnóstico rápido: eu revisei o `Hero.tsx` e o problema está claro no código atual. Hoje o bloco esquerdo ainda está “colado” porque a hierarquia vertical continua curta para o tamanho visual do hero: badge `mb-5`, título `mb-5`, subtítulo `mb-8`, card `mb-7`. Para a escala do título e do card, isso realmente fica comprimido.

Plano de correção

1. Reorganizar o bloco esquerdo como dois blocos visuais
- Bloco 1: selo + headline + subtítulo
- Bloco 2: card de busca + CTA secundário
- Em vez de só microajustar margens soltas, vou reconstruir a lógica de espaçamento para o conjunto ter ritmo visual claro.

2. Aumentar de forma perceptível o espaço entre os blocos principais
Vou aumentar especialmente no desktop/notebook:
- selo → título
- título → subtítulo
- subtítulo → card branco
- card branco → linha de CTA secundário

Direção:
- título/subtítulo: aumento moderado
- subtítulo/card: aumento mais forte
- card/CTA secundário: aumento forte o suficiente para parar de parecer “colado”

3. Preservar o card branco compacto
- Não vou inflar o card novamente
- Vou manter a busca compacta e horizontal
- O ganho de respiro virá principalmente do espaço externo entre os blocos, não de padding exagerado dentro do card

4. Refinar a linha abaixo do card
- Ajustar alinhamento do botão “Quero anunciar meu espaço” com o link do simulador
- Melhorar a leitura horizontal dessa linha
- Dar mais separação do card acima sem deixar a linha solta demais

5. Ajustar responsividade com escala coerente
- Desktop: aumento mais evidente do respiro
- Notebook/tablet: versão intermediária
- Mobile: manter limpeza sem criar hero longo demais

O que não vou mexer
- overlay/fade da imagem
- lógica da busca
- campos de localização, período e volume
- estrutura geral da home
- protagonismo da busca

Resultado esperado
- o título deixa de encostar visualmente no subtítulo
- o subtítulo ganha “ar” antes do quadrante de campos
- o card deixa de pressionar a linha de botões abaixo
- o bloco esquerdo passa a parecer uma composição intencional, e não elementos empilhados com gaps curtos

Entrega prevista
No final da implementação eu vou te informar exatamente:
- quais espaçamentos foram ampliados
- como o bloco esquerdo foi reorganizado
- como o card continuou compacto sem ficar apertado
- como a linha abaixo da busca foi refinada
