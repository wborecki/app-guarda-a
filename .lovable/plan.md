

# Gerar Imagens com Veículos via AI Image Generation

## Contexto
O hero da home usa `src/assets/hero-bg-new.jpg` (desktop only). As landing pages QueroGuardar e HostLanding não usam imagens de fundo — apenas ícones e texto. Precisamos gerar imagens que reforcem visualmente o reposicionamento para veículos.

## Plano

### 1. Criar edge function para gerar imagens via Lovable AI
- Nova edge function `generate-hero-image` que chama o modelo `google/gemini-3-pro-image-preview` (melhor qualidade)
- Gera a imagem com prompt descritivo: cenário de garagem/espaço de armazenamento organizado contendo um carro, uma moto, caixas empilhadas e objetos pessoais — estilo editorial limpo, iluminação natural, paleta neutra/moderna
- Faz upload do resultado base64 para um bucket de storage (`site-assets`)
- Retorna a URL pública da imagem

### 2. Gerar 2 imagens
- **Hero principal (home)**: Cenário wide/landscape de garagem moderna com carro estacionado, moto ao lado, prateleiras com caixas — transmitindo "espaço para tudo"
- **Imagem de apoio (QueroGuardar/HostLanding)**: Cenário mais compacto mostrando vaga organizada com veículo e objetos, reforçando versatilidade

### 3. Criar página/componente admin para gerar as imagens
- Botão simples (temporário ou na área admin) que dispara a geração
- Após geradas, as imagens ficam no storage e são referenciadas pelo código

### 4. Atualizar componentes para usar as novas imagens
- `Hero.tsx`: Trocar `hero-bg-new.jpg` pela nova imagem gerada (com fallback para a atual)
- `QueroGuardar.tsx`: Adicionar imagem de apoio no hero section (opcional, se o layout comportar)
- `HostLanding.tsx`: Adicionar imagem ilustrativa na seção hero

### 5. Storage bucket
- Criar bucket `site-assets` (público) para armazenar as imagens geradas

## Abordagem técnica
- Edge function recebe o prompt como parâmetro, chama a API `ai.gateway.lovable.dev`, converte base64 para file, faz upload ao storage
- No frontend, componentes referenciam as URLs públicas do storage
- Fallback para a imagem atual caso a do storage não exista

## Resultado esperado
- Hero da home com imagem que mostra veículos + objetos lado a lado
- Reforço visual do reposicionamento estratégico em toda a jornada

