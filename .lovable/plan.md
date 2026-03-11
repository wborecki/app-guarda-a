

## Ajuste fino: card → CTA secundário

O card de busca hoje tem `mb-8 md:mb-10` (linha 112) separando-o da linha de CTA secundário. Isso está criando o gap excessivo.

### Alterações

**1. Reduzir espaço card → CTA secundário**
- Linha 112: `mb-8 md:mb-10` → `mb-5 md:mb-6`

**2. Dar mais presença ao link do simulador**
- Linha 255: aumentar tamanho do texto de `text-[13px]` para `text-sm`
- Ajustar cor para `text-muted-foreground/80` (levemente mais visível)

Nenhuma outra alteração no hero.

