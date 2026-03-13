export type StorageMode = "objects" | "vehicles";

export interface VehicleCategory {
  id: string;
  nome: string;
  grupo: string;
  /** Comprimento médio em cm */
  comprimento: number;
  /** Largura média em cm */
  largura: number;
  /** Altura média em cm */
  altura: number;
  icon: string; // emoji
}

export const vehicleCategories: VehicleCategory[] = [
  // Motos
  { id: "moto-pequena",    nome: "Moto pequena (até 250cc)",     grupo: "Motos",      comprimento: 200, largura: 80,  altura: 110, icon: "🏍️" },
  { id: "moto-grande",     nome: "Moto grande (acima de 250cc)", grupo: "Motos",      comprimento: 230, largura: 90,  altura: 120, icon: "🏍️" },

  // Carros
  { id: "carro-pequeno",   nome: "Carro pequeno (hatch)",        grupo: "Carros",     comprimento: 380, largura: 170, altura: 150, icon: "🚗" },
  { id: "carro-sedan",     nome: "Sedã",                         grupo: "Carros",     comprimento: 450, largura: 180, altura: 150, icon: "🚗" },
  { id: "suv",             nome: "SUV",                          grupo: "Carros",     comprimento: 460, largura: 185, altura: 170, icon: "🚙" },
  { id: "caminhonete",     nome: "Caminhonete / Pickup",         grupo: "Carros",     comprimento: 530, largura: 195, altura: 180, icon: "🛻" },

  // Utilitários
  { id: "van-utilitario",  nome: "Van / Utilitário leve",        grupo: "Utilitários", comprimento: 500, largura: 200, altura: 220, icon: "🚐" },
  { id: "reboque-pequeno", nome: "Reboque pequeno",              grupo: "Utilitários", comprimento: 350, largura: 180, altura: 150, icon: "🚛" },

  // Náuticos
  { id: "jet-ski",         nome: "Jet Ski",                      grupo: "Náuticos",   comprimento: 320, largura: 130, altura: 110, icon: "🚤" },
  { id: "barco-pequeno",   nome: "Barco pequeno (até 5m)",       grupo: "Náuticos",   comprimento: 500, largura: 200, altura: 160, icon: "⛵" },
  { id: "trailer-pequeno", nome: "Trailer pequeno",              grupo: "Náuticos",   comprimento: 550, largura: 220, altura: 260, icon: "🏕️" },
];

export const vehicleGroups = [...new Set(vehicleCategories.map((v) => v.grupo))];

/** Volume estimado em m³ com margem de manobra (+20%) */
export function vehicleVolume(vehicle: VehicleCategory): number {
  const raw = (vehicle.comprimento / 100) * (vehicle.largura / 100) * (vehicle.altura / 100);
  return Math.round(raw * 1.2 * 10) / 10; // +20% margem
}

/** Área em m² que o veículo ocupa no chão */
export function vehicleFootprint(vehicle: VehicleCategory): number {
  return Math.round((vehicle.comprimento / 100) * (vehicle.largura / 100) * 10) / 10;
}

/** Etiqueta legível de tamanho */
export function vehicleSizeLabel(vehicle: VehicleCategory): string {
  const fp = vehicleFootprint(vehicle);
  return `${(vehicle.comprimento / 100).toFixed(1)}m × ${(vehicle.largura / 100).toFixed(1)}m · ~${fp} m²`;
}

/** Populares para exibição rápida */
export const popularVehicleIds = [
  "moto-pequena",
  "carro-pequeno",
  "suv",
  "caminhonete",
  "jet-ski",
  "barco-pequeno",
];
