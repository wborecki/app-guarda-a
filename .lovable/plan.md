

# Revisar SpaceDetails -- Veiculos com Mais Destaque

## Estado Atual
A secao de compatibilidade com veiculos (linhas 290-335) ja existe mas esta visualmente discreta -- pequenos chips cinza dentro de um bloco condicional, sem destaque visual forte. As dimensoes do portao aparecem como texto simples. Nao ha tags de uso (objetos/veiculos/ambos) visiveis no topo.

## Plano de Implementacao

### 1. Adicionar tags de uso com destaque no topo do bloco de detalhes
- Logo abaixo do titulo do espaco (linha ~210), adicionar badges coloridos indicando o tipo de uso:
  - "Objetos" (icone Package, badge azul)
  - "Veiculos" (icone Car, badge verde)
  - "Objetos e Veiculos" (ambos badges)
- Badges visiveis e proeminentes, antes da descricao

### 2. Redesenhar secao de veiculos compativeis
- Mover a secao para **antes** das comodidades (acima de "Comodidades e diferenciais") para maior visibilidade
- Usar cards mais visuais: fundo com cor primaria sutil, icone maior, nome do veiculo + dimensoes resumidas (ex: "2.0m x 0.8m")
- Adicionar indicador visual de "cabe / nao cabe" baseado nas dimensoes do portao vs veiculo

### 3. Destacar dimensoes do portao
- Transformar as dimensoes do portao em um mini-card dedicado com icone DoorOpen maior e layout horizontal
- Adicionar label "Entrada" com largura x altura em formato visual (ex: "2.8m x 2.5m")
- Se o espaco for coberto/descoberto, incluir essa info no mesmo card

### 4. Mostrar secao de veiculos mesmo quando space_use e "objects"
- Quando `space_use === "objects"`, exibir um aviso discreto: "Este espaco e destinado apenas a objetos"
- Quando `space_use === "both"` ou `"vehicles"`, mostrar a secao completa redesenhada

## Arquivos Alterados
- `src/pages/SpaceDetails.tsx` -- unico arquivo, reorganizacao e redesign das secoes mencionadas

## Resultado Esperado
- Tags de uso visiveis imediatamente abaixo do titulo
- Secao de veiculos compativeis mais proeminente com cards visuais
- Dimensoes do portao em destaque com layout dedicado
- Experiencia mais clara para quem busca guardar veiculos

