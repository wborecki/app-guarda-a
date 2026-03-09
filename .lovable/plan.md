

## Plano: Calcular dias automaticamente a partir das datas

Remover o campo "Quantos dias?" e calcular `days` automaticamente com base na diferença entre a data de retirada e a data de entrega usando `differenceInDays` do `date-fns`.

### Alterações em `src/components/guardaai/Simulator.tsx`

1. Importar `differenceInDays` de `date-fns`
2. Remover o estado `days` e o campo `Input` de "Quantos dias?"
3. Calcular `days` como variável derivada: `const days = (deliveryDate && pickupDate) ? Math.max(differenceInDays(pickupDate, deliveryDate), 1) : 0`
4. Ajustar o layout do grid de "Cidade ou bairro" para ocupar a largura toda (já que o campo de dias será removido)
5. Ajustar a condição do botão "Simular" para exigir que ambas as datas estejam preenchidas
6. Mostrar a quantidade de dias calculada no resultado da simulação

