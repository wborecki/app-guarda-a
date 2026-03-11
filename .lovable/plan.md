

## Problema

O header usa `bg-background/92 backdrop-blur-md` — a opacidade de 92% sobre a imagem hero ainda deixa os botões "ghost" (user name + admin) quase invisíveis, pois eles usam `text-foreground` e `text-muted-foreground` sem fundo sólido, se perdendo contra o hero escuro que transparece.

## Solução

Duas mudanças complementares:

1. **Aumentar opacidade do header** — trocar `bg-background/92` por `bg-background/97` (ou `bg-background`) para que o fundo do header seja praticamente sólido e os textos sempre legíveis.

2. **Dar mais destaque aos botões de usuário e admin** — em vez de `variant="ghost"` sem fundo, adicionar um fundo sutil (`bg-secondary/80`) e garantir contraste. Especificamente:
   - Botão do usuário logado (linha ~90): trocar classe para `bg-secondary/80 hover:bg-secondary text-foreground`
   - Botão Admin (linha ~109): trocar classe para `bg-secondary/80 hover:bg-secondary text-foreground`

Isso mantém o visual clean mas garante legibilidade sobre qualquer fundo.

## Arquivos alterados

- `src/components/guardaai/Header.tsx` — ajustar opacidade do header e classes dos botões de usuário/admin (desktop)

