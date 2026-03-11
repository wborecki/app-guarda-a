import garageA1 from "@/assets/spaces/garage-a1.jpg";
import garageA2 from "@/assets/spaces/garage-a2.jpg";
import garageA3 from "@/assets/spaces/garage-a3.jpg";
import roomA1 from "@/assets/spaces/room-a1.jpg";
import roomA2 from "@/assets/spaces/room-a2.jpg";
import roomA3 from "@/assets/spaces/room-a3.jpg";
import depositA1 from "@/assets/spaces/deposit-a1.jpg";
import depositA2 from "@/assets/spaces/deposit-a2.jpg";
import depositA3 from "@/assets/spaces/deposit-a3.jpg";
import coveredA1 from "@/assets/spaces/covered-a1.jpg";
import coveredA2 from "@/assets/spaces/covered-a2.jpg";
import coveredA3 from "@/assets/spaces/covered-a3.jpg";
import shedA1 from "@/assets/spaces/shed-a1.jpg";
import shedA2 from "@/assets/spaces/shed-a2.jpg";
import shedA3 from "@/assets/spaces/shed-a3.jpg";

// ─── City database with coordinates ───────────────────────────────
export type CityData = {
  city: string;
  state: string;
  lat: number;
  lng: number;
  neighborhoods: { name: string; street: string; number: string; lat: number; lng: number }[];
};

export const cityDatabase: Record<string, CityData> = {
  curitiba: {
    city: "Curitiba", state: "PR", lat: -25.4284, lng: -49.2733,
    neighborhoods: [
      { name: "Centro", street: "Rua Emiliano Perneta", number: "340", lat: -25.4290, lng: -49.2710 },
      { name: "Batel", street: "Rua Coronel Dulcídio", number: "185", lat: -25.4410, lng: -49.2890 },
      { name: "Água Verde", street: "Rua Brasílio Itiberê", number: "455", lat: -25.4500, lng: -49.2810 },
      { name: "Rebouças", street: "Rua Rockefeller", number: "72", lat: -25.4430, lng: -49.2660 },
      { name: "Alto da XV", street: "Rua Fernando Amaro", number: "290", lat: -25.4320, lng: -49.2550 },
      { name: "Juvevê", street: "Rua Augusto Stresser", number: "112", lat: -25.4170, lng: -49.2640 },
      { name: "Mercês", street: "Rua Jaime Reis", number: "540", lat: -25.4230, lng: -49.2830 },
      { name: "São Francisco", street: "Rua São Francisco", number: "88", lat: -25.4260, lng: -49.2750 },
    ],
  },
  "são paulo": {
    city: "São Paulo", state: "SP", lat: -23.5505, lng: -46.6333,
    neighborhoods: [
      { name: "Consolação", street: "Rua Augusta", number: "1200", lat: -23.5530, lng: -46.6560 },
      { name: "Bela Vista", street: "Rua Treze de Maio", number: "900", lat: -23.5600, lng: -46.6480 },
      { name: "Vila Mariana", street: "Rua Vergueiro", number: "3100", lat: -23.5850, lng: -46.6380 },
      { name: "Vila Madalena", street: "Rua Harmonia", number: "450", lat: -23.5500, lng: -46.6900 },
      { name: "Pinheiros", street: "Rua dos Pinheiros", number: "800", lat: -23.5660, lng: -46.6930 },
      { name: "Moema", street: "Av. Ibirapuera", number: "2120", lat: -23.6010, lng: -46.6600 },
      { name: "Itaim Bibi", street: "Rua João Cachoeira", number: "350", lat: -23.5820, lng: -46.6780 },
      { name: "Lapa", street: "Rua Guaicurus", number: "200", lat: -23.5260, lng: -46.7020 },
    ],
  },
  "rio de janeiro": {
    city: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729,
    neighborhoods: [
      { name: "Copacabana", street: "Rua Barata Ribeiro", number: "300", lat: -22.9700, lng: -43.1860 },
      { name: "Botafogo", street: "Rua Voluntários da Pátria", number: "120", lat: -22.9510, lng: -43.1870 },
      { name: "Tijuca", street: "Rua Conde de Bonfim", number: "800", lat: -22.9280, lng: -43.2350 },
      { name: "Leblon", street: "Rua Dias Ferreira", number: "250", lat: -22.9830, lng: -43.2230 },
      { name: "Flamengo", street: "Rua Marquês de Abrantes", number: "150", lat: -22.9320, lng: -43.1760 },
      { name: "Ipanema", street: "Rua Visconde de Pirajá", number: "500", lat: -22.9840, lng: -43.2030 },
      { name: "Centro", street: "Av. Rio Branco", number: "100", lat: -22.9030, lng: -43.1770 },
      { name: "Lapa", street: "Rua do Lavradio", number: "80", lat: -22.9120, lng: -43.1830 },
    ],
  },
  "belo horizonte": {
    city: "Belo Horizonte", state: "MG", lat: -19.9167, lng: -43.9345,
    neighborhoods: [
      { name: "Savassi", street: "Rua Pernambuco", number: "1000", lat: -19.9360, lng: -43.9370 },
      { name: "Funcionários", street: "Rua Fernandes Tourinho", number: "350", lat: -19.9300, lng: -43.9310 },
      { name: "Lourdes", street: "Rua São Paulo", number: "1500", lat: -19.9270, lng: -43.9420 },
      { name: "Centro", street: "Av. Afonso Pena", number: "800", lat: -19.9190, lng: -43.9380 },
      { name: "Prado", street: "Rua Platina", number: "200", lat: -19.9380, lng: -43.9560 },
      { name: "Gutierrez", street: "Rua Araguari", number: "100", lat: -19.9430, lng: -43.9610 },
      { name: "Santa Efigênia", street: "Rua Pouso Alegre", number: "500", lat: -19.9230, lng: -43.9240 },
      { name: "Floresta", street: "Rua Salinas", number: "300", lat: -19.9150, lng: -43.9280 },
    ],
  },
};

const defaultCity: CityData = {
  city: "Sua região", state: "", lat: -25.4284, lng: -49.2733,
  neighborhoods: [
    { name: "Centro", street: "Rua Principal", number: "100", lat: -25.4290, lng: -49.2710 },
    { name: "Bairro Norte", street: "Av. Norte", number: "200", lat: -25.4200, lng: -49.2680 },
    { name: "Bairro Sul", street: "Rua Sul", number: "300", lat: -25.4380, lng: -49.2750 },
    { name: "Zona Leste", street: "Rua Leste", number: "400", lat: -25.4300, lng: -49.2600 },
    { name: "Vila Nova", street: "Av. Brasil", number: "500", lat: -25.4350, lng: -49.2800 },
    { name: "Bairro Alto", street: "Rua São José", number: "80", lat: -25.4150, lng: -49.2720 },
    { name: "Boa Vista", street: "Rua XV de Novembro", number: "300", lat: -25.4250, lng: -49.2650 },
    { name: "Industrial", street: "Rua dos Operários", number: "150", lat: -25.4450, lng: -49.2900 },
  ],
};

export const spaceTemplates = [
  { name: "Garagem coberta disponível", type: "Garagem", area: 12, pricePerDay: 8, description: "Garagem residencial coberta com portão automático. Espaço limpo e seco, ideal para caixas, móveis e itens do dia a dia.", photos: [garageA1, garageA2, garageA3], features: ["Portão automático", "Câmeras", "Acesso fácil"] },
  { name: "Quarto extra em apartamento", type: "Quarto", area: 9, pricePerDay: 6, description: "Quarto vazio em apartamento com portaria e elevador. Ambiente fechado e arejado, perfeito para itens que precisam de cuidado.", photos: [roomA1, roomA2, roomA3], features: ["Portaria 24h", "Elevador", "Climatizado"] },
  { name: "Depósito organizado", type: "Depósito", area: 20, pricePerDay: 12, description: "Depósito com prateleiras metálicas e piso nivelado. Espaço prático para estoque, equipamentos ou volumes variados.", photos: [depositA1, depositA2, depositA3], features: ["Seguro incluso", "Acesso 24h", "Piso nivelado"] },
  { name: "Área coberta nos fundos", type: "Área coberta", area: 15, pricePerDay: 7, description: "Área coberta nos fundos de casa em bairro residencial. Ambiente arejado com acesso fácil para carga e descarga.", photos: [coveredA1, coveredA2, coveredA3], features: ["Ambiente seco", "Rua tranquila", "Fácil acesso"] },
  { name: "Galpão pequeno nos fundos", type: "Galpão", area: 25, pricePerDay: 15, description: "Galpão com pé direito alto e portão largo. Ideal para móveis maiores, equipamentos ou volumes grandes.", photos: [shedA1, shedA2, shedA3], features: ["Portão largo", "Pé direito alto", "Veículos entram"] },
];

export const ownerProfiles = [
  { name: "Carlos M.", since: "2023", description: "Moro no bairro há 15 anos. Ofereço minha garagem extra." },
  { name: "Ana P.", since: "2022", description: "Tenho um quarto sobrando e resolvi ajudar quem precisa." },
  { name: "Roberto S.", since: "2021", description: "Disponibilizo meu depósito que não uso mais." },
  { name: "Mariana L.", since: "2023", description: "Minha área coberta fica vazia, então resolvi compartilhar." },
  { name: "João F.", since: "2022", description: "Tenho um galpão nos fundos, ideal para guardar coisas grandes." },
];

export const reviewsPool = [
  { name: "Pedro A.", rating: 5, date: "2024-01-15", text: "Excelente espaço, muito seguro e organizado." },
  { name: "Lucia R.", rating: 5, date: "2024-02-20", text: "Guardei meus móveis sem problemas. Recomendo!" },
  { name: "Fernando G.", rating: 4, date: "2023-12-10", text: "Bom espaço, proprietário atencioso e pontual." },
  { name: "Sandra L.", rating: 5, date: "2024-02-05", text: "Ótimo local, exatamente como descrito no anúncio." },
  { name: "Diego C.", rating: 4, date: "2023-11-20", text: "Muito prático e bem localizado. Voltarei a usar." },
];

export const spaceTypesList = ["Garagem", "Quarto", "Depósito", "Área coberta", "Galpão"];

export const distanceOptions = [
  { label: "Até 1 km", value: 1 },
  { label: "Até 3 km", value: 3 },
  { label: "Até 5 km", value: 5 },
  { label: "Até 10 km", value: 10 },
];

export const ratingOptions = [
  { label: "4.0+", value: 4.0 },
  { label: "4.5+", value: 4.5 },
  { label: "4.8+", value: 4.8 },
];

export const allFeatures = [
  "Câmeras", "Portão automático", "Acesso fácil", "Portaria 24h", "Elevador",
  "Climatizado", "Seguro incluso", "Piso nivelado", "Acesso 24h", "Ambiente seco",
  "Portão largo", "Pé direito alto",
];

export type SortOption = "proximity" | "price_asc" | "rating" | "area_desc" | "relevance";

export const sortLabels: Record<SortOption, string> = {
  proximity: "Mais próximos",
  price_asc: "Menor preço",
  rating: "Melhor avaliação",
  area_desc: "Maior espaço",
  relevance: "Mais relevantes",
};

export type Filters = {
  types: string[];
  maxPrice: number | null;
  maxDistance: number | null;
  minRating: number | null;
  features: string[];
};

export const emptyFilters: Filters = { types: [], maxPrice: null, maxDistance: null, minRating: null, features: [] };

// ─── Helpers ───────────────────────────────────────────────────────
export function detectCity(locationStr: string): CityData {
  const lower = locationStr.toLowerCase();
  for (const [key, data] of Object.entries(cityDatabase)) {
    if (lower.includes(key)) return data;
  }
  const parts = locationStr.split(",").map((s) => s.trim());
  if (parts.length >= 2) return { ...defaultCity, city: parts[1] || parts[0] };
  return { ...defaultCity, city: parts[0] || "Sua região" };
}

export function shortenLocation(locationStr: string): string {
  if (!locationStr || locationStr === "Não informado") return "Não informado";
  const lower = locationStr.toLowerCase();
  for (const [key, data] of Object.entries(cityDatabase)) {
    if (lower.includes(key)) {
      const parts = locationStr.split(",").map((s) => s.trim()).filter(Boolean);
      for (const part of parts) {
        const partLower = part.toLowerCase();
        for (const n of data.neighborhoods) {
          if (partLower.includes(n.name.toLowerCase())) return `${n.name}, ${data.city}`;
        }
      }
      if (parts[0] && parts[0].length <= 35 && !parts[0].toLowerCase().includes(key)) return `${parts[0]} – ${data.city}`;
      return `Centro, ${data.city}`;
    }
  }
  const parts = locationStr.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}, ${parts[1]}`;
  return parts[0] || locationStr;
}

export function generateSpacesForCity(locationStr: string) {
  const cityData = detectCity(locationStr);
  const distances = [0.8, 1.4, 2.1, 3.2, 4.5];
  const ratings = [4.8, 4.9, 4.6, 5.0, 4.7];
  const reviewCounts = [23, 41, 15, 8, 19];

  return spaceTemplates.map((template, i) => {
    const neighborhood = cityData.neighborhoods[i % cityData.neighborhoods.length];
    const owner = ownerProfiles[i];
    return {
      id: i + 1, ...template,
      owner: owner.name, ownerPhoto: `https://i.pravatar.cc/100?img=${20 + i}`,
      ownerSince: owner.since, ownerDescription: owner.description,
      rating: ratings[i], reviews: reviewCounts[i],
      address: `${neighborhood.street}, ${neighborhood.number} – ${neighborhood.name}`,
      neighborhood: neighborhood.name, city: cityData.city,
      distance: `${distances[i]} km`, distanceNum: distances[i],
      reviewsList: reviewsPool.slice(0, 2 + (i % 2)),
      lat: neighborhood.lat,
      lng: neighborhood.lng,
    };
  });
}

// ─── Smart badges logic ────────────────────────────────────────────
export type SmartBadge = { label: string; tier: "primary" };

export function computePrimaryBadge(space: any, allSpaces: any[]): SmartBadge | null {
  const byPrice = [...allSpaces].sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (byPrice[0]?.id === space.id) return { label: "Melhor custo", tier: "primary" };
  const byDist = [...allSpaces].sort((a, b) => a.distanceNum - b.distanceNum);
  if (byDist[0]?.id === space.id) return { label: "Mais próximo", tier: "primary" };
  const byRating = [...allSpaces].sort((a, b) => b.rating - a.rating);
  if (byRating[0]?.id === space.id) return { label: "Mais bem avaliado", tier: "primary" };
  if (space.area >= 20) return { label: "Grande capacidade", tier: "primary" };
  return null;
}

export function getUseCaseHint(type: string): string {
  switch (type) {
    case "Garagem": return "Ideal para mudanças e itens volumosos";
    case "Quarto": return "Perfeito para caixas e objetos pessoais";
    case "Depósito": return "Ótimo para estoque e equipamentos";
    case "Área coberta": return "Bom para itens que precisam de ventilação";
    case "Galpão": return "Para móveis grandes e volumes pesados";
    default: return "Espaço versátil para diversas necessidades";
  }
}
