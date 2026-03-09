export interface ItemDimension {
  id: string;
  nome: string;
  categoria: string;
  altura: number; // cm
  largura: number; // cm
  comprimento: number; // cm
}

export const itemDimensions: ItemDimension[] = [
  // Móveis
  { id: "sofa-2-lugares", nome: "Sofá 2 lugares", categoria: "Móveis", altura: 85, largura: 160, comprimento: 80 },
  { id: "sofa-3-lugares", nome: "Sofá 3 lugares", categoria: "Móveis", altura: 85, largura: 200, comprimento: 90 },
  { id: "sofa-canto", nome: "Sofá de canto (L)", categoria: "Móveis", altura: 85, largura: 250, comprimento: 200 },
  { id: "cama-solteiro", nome: "Cama solteiro", categoria: "Móveis", altura: 45, largura: 88, comprimento: 188 },
  { id: "cama-casal", nome: "Cama casal", categoria: "Móveis", altura: 45, largura: 138, comprimento: 188 },
  { id: "cama-queen", nome: "Cama queen", categoria: "Móveis", altura: 45, largura: 158, comprimento: 198 },
  { id: "cama-king", nome: "Cama king", categoria: "Móveis", altura: 45, largura: 193, comprimento: 203 },
  { id: "colchao-casal", nome: "Colchão casal", categoria: "Móveis", altura: 25, largura: 138, comprimento: 188 },
  { id: "colchao-queen", nome: "Colchão queen", categoria: "Móveis", altura: 25, largura: 158, comprimento: 198 },
  { id: "guarda-roupa-2p", nome: "Guarda-roupa 2 portas", categoria: "Móveis", altura: 200, largura: 100, comprimento: 50 },
  { id: "guarda-roupa-4p", nome: "Guarda-roupa 4 portas", categoria: "Móveis", altura: 200, largura: 180, comprimento: 50 },
  { id: "guarda-roupa-6p", nome: "Guarda-roupa 6 portas", categoria: "Móveis", altura: 200, largura: 260, comprimento: 55 },
  { id: "comoda", nome: "Cômoda", categoria: "Móveis", altura: 80, largura: 120, comprimento: 45 },
  { id: "criado-mudo", nome: "Criado-mudo", categoria: "Móveis", altura: 55, largura: 45, comprimento: 35 },
  { id: "mesa-jantar-4", nome: "Mesa de jantar 4 lugares", categoria: "Móveis", altura: 78, largura: 120, comprimento: 80 },
  { id: "mesa-jantar-6", nome: "Mesa de jantar 6 lugares", categoria: "Móveis", altura: 78, largura: 160, comprimento: 90 },
  { id: "mesa-escritorio", nome: "Mesa de escritório", categoria: "Móveis", altura: 75, largura: 120, comprimento: 60 },
  { id: "cadeira", nome: "Cadeira", categoria: "Móveis", altura: 90, largura: 45, comprimento: 45 },
  { id: "estante", nome: "Estante / Prateleira", categoria: "Móveis", altura: 180, largura: 90, comprimento: 30 },
  { id: "rack-tv", nome: "Rack para TV", categoria: "Móveis", altura: 55, largura: 160, comprimento: 40 },
  { id: "sapateira", nome: "Sapateira", categoria: "Móveis", altura: 100, largura: 60, comprimento: 30 },
  { id: "berco", nome: "Berço", categoria: "Móveis", altura: 90, largura: 70, comprimento: 130 },

  // Eletrodomésticos
  { id: "geladeira-pequena", nome: "Geladeira 1 porta (260L)", categoria: "Eletrodomésticos", altura: 150, largura: 55, comprimento: 58 },
  { id: "geladeira-duplex", nome: "Geladeira duplex (375L)", categoria: "Eletrodomésticos", altura: 180, largura: 60, comprimento: 65 },
  { id: "geladeira-frost-free", nome: "Geladeira Frost Free (450L)", categoria: "Eletrodomésticos", altura: 190, largura: 65, comprimento: 70 },
  { id: "fogao-4-bocas", nome: "Fogão 4 bocas", categoria: "Eletrodomésticos", altura: 85, largura: 50, comprimento: 55 },
  { id: "fogao-5-bocas", nome: "Fogão 5 bocas", categoria: "Eletrodomésticos", altura: 85, largura: 70, comprimento: 60 },
  { id: "maquina-lavar", nome: "Máquina de lavar (11kg)", categoria: "Eletrodomésticos", altura: 100, largura: 60, comprimento: 65 },
  { id: "secadora", nome: "Secadora de roupas", categoria: "Eletrodomésticos", altura: 85, largura: 60, comprimento: 60 },
  { id: "micro-ondas", nome: "Micro-ondas", categoria: "Eletrodomésticos", altura: 30, largura: 50, comprimento: 40 },
  { id: "ar-condicionado", nome: "Ar-condicionado (condensadora)", categoria: "Eletrodomésticos", altura: 55, largura: 80, comprimento: 30 },
  { id: "aspirador", nome: "Aspirador de pó", categoria: "Eletrodomésticos", altura: 50, largura: 35, comprimento: 35 },

  // Eletrônicos
  { id: "tv-32", nome: "TV 32 polegadas", categoria: "Eletrônicos", altura: 45, largura: 73, comprimento: 8 },
  { id: "tv-50", nome: "TV 50 polegadas", categoria: "Eletrônicos", altura: 65, largura: 112, comprimento: 8 },
  { id: "tv-55", nome: "TV 55 polegadas", categoria: "Eletrônicos", altura: 72, largura: 124, comprimento: 8 },
  { id: "tv-65", nome: "TV 65 polegadas", categoria: "Eletrônicos", altura: 83, largura: 145, comprimento: 8 },
  { id: "computador-desktop", nome: "Computador desktop + monitor", categoria: "Eletrônicos", altura: 50, largura: 60, comprimento: 50 },
  { id: "impressora", nome: "Impressora", categoria: "Eletrônicos", altura: 25, largura: 45, comprimento: 35 },

  // Caixas
  { id: "caixa-pequena", nome: "Caixa pequena (30x30x30)", categoria: "Caixas", altura: 30, largura: 30, comprimento: 30 },
  { id: "caixa-media", nome: "Caixa média (50x40x40)", categoria: "Caixas", altura: 40, largura: 50, comprimento: 40 },
  { id: "caixa-grande", nome: "Caixa grande (60x50x50)", categoria: "Caixas", altura: 50, largura: 60, comprimento: 50 },
  { id: "caixa-mudanca", nome: "Caixa de mudança (70x50x50)", categoria: "Caixas", altura: 50, largura: 70, comprimento: 50 },
  { id: "mala-viagem", nome: "Mala de viagem grande", categoria: "Caixas", altura: 75, largura: 50, comprimento: 30 },
  { id: "mala-viagem-media", nome: "Mala de viagem média", categoria: "Caixas", altura: 60, largura: 40, comprimento: 25 },

  // Esporte e Lazer
  { id: "bicicleta", nome: "Bicicleta", categoria: "Esporte", altura: 100, largura: 170, comprimento: 60 },
  { id: "prancha-surf", nome: "Prancha de surf", categoria: "Esporte", altura: 8, largura: 55, comprimento: 200 },
  { id: "esteira", nome: "Esteira ergométrica", categoria: "Esporte", altura: 140, largura: 70, comprimento: 170 },
  { id: "bicicleta-ergometrica", nome: "Bicicleta ergométrica", categoria: "Esporte", altura: 130, largura: 55, comprimento: 100 },

  // Veículos e acessórios
  { id: "pneu", nome: "Pneu (jogo 4 unidades)", categoria: "Veículos", altura: 65, largura: 65, comprimento: 100 },
  { id: "moto", nome: "Motocicleta", categoria: "Veículos", altura: 110, largura: 80, comprimento: 200 },

  // Outros
  { id: "piano-digital", nome: "Piano digital / Teclado", categoria: "Outros", altura: 85, largura: 140, comprimento: 45 },
  { id: "churrasqueira", nome: "Churrasqueira portátil", categoria: "Outros", altura: 90, largura: 60, comprimento: 50 },
  { id: "ferramentas", nome: "Caixa de ferramentas grande", categoria: "Outros", altura: 40, largura: 60, comprimento: 30 },
];

export const categorias = [...new Set(itemDimensions.map((i) => i.categoria))];
