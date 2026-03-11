

## Diagnóstico

Encontrei o problema principal: o input de foto (linha 374) não tem nenhum `onChange` handler nem estado para armazenar os arquivos selecionados. O `<input type="file">` está no HTML mas é completamente inerte — nada acontece ao selecionar arquivos.

Os botões "Continuar" e "Voltar" funcionam (controlam `setStep`). O botão "Cadastrar meu espaço" dispara `handleSubmit` que abre o WhatsApp.

## Plano

### 1. Adicionar estado para fotos
Adicionar `photos: File[]` ao estado do componente e um handler `handlePhotoChange` que:
- Aceita arquivos do input
- Limita a 5 fotos
- Mostra toast se exceder o limite

### 2. Conectar o input ao estado
Adicionar `onChange={handlePhotoChange}` no `<input type="file">` e exibir feedback visual:
- Quantidade de fotos selecionadas
- Nomes/previews das fotos
- Botão para remover fotos individuais

### 3. Incluir fotos na mensagem do WhatsApp
Como o WhatsApp não suporta envio de arquivos via URL, adicionar uma nota na mensagem informando a quantidade de fotos e instruir o usuário a enviá-las na conversa.

Arquivos alterados: `src/pages/HostLanding.tsx` apenas.

