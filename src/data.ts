export type SeasonKey = "Primavera" | "Verano" | "Otoño" | "Invierno";
export type StoreKey = "Todas" | "Tienda 1" | "Tienda 2" | "Tienda 3";
export type PeriodKey = "Semana" | "Mes" | "Estación";

export const cafeData = {
  brandName: "CaféSmart",
  stores: {
    Todas: { factor: 1, peak: "08:00 — 10:30", day: "Viernes" },
    "Tienda 1": { factor: 0.36, peak: "08:00 — 10:00", day: "Viernes" },
    "Tienda 2": { factor: 0.34, peak: "08:30 — 11:00", day: "Jueves" },
    "Tienda 3": { factor: 0.3, peak: "07:30 — 09:30", day: "Martes" },
  } satisfies Record<StoreKey, { factor: number; peak: string; day: string }>,
  periods: {
    Semana: {
      labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"],
      values: [62, 75, 69, 88, 80, 94, 86, 98],
      multiplier: 0.25,
      detail: "Próximas 8 semanas",
    },
    Mes: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      values: [58, 67, 74, 81, 88, 96],
      multiplier: 1.5,
      detail: "Próximos 6 meses",
    },
    Estación: {
      labels: ["Primavera", "Verano", "Otoño", "Invierno"],
      values: [68, 96, 84, 64],
      multiplier: 4,
      detail: "Próximas 4 estaciones",
    },
  } satisfies Record<PeriodKey, { labels: string[]; values: number[]; multiplier: number; detail: string }>,
  seasons: {
    Primavera: { sales: 48320, star: "Latte", accuracy: "94.2%" },
    Verano: { sales: 56890, star: "Café americano", accuracy: "95.6%" },
    Otoño: { sales: 51670, star: "Té chai", accuracy: "93.8%" },
    Invierno: { sales: 44210, star: "Latte", accuracy: "92.4%" },
  } satisfies Record<SeasonKey, { sales: number; star: string; accuracy: string }>,
  summaryCombos: [
    "Latte + Croissant",
    "Café americano + Sándwich",
    "Té chai + Croissant",
  ],
  seasonalIngredients: [
    ["Café molido", "185 kg", "740 kg", "Comprar"],
    ["Leche entera", "420 L", "1,680 L", "Comprar"],
    ["Hielo", "310 kg", "1,240 kg", "Ajustado"],
    ["Pan artesanal", "240 u.", "960 u.", "En stock"],
  ],
  products: [
    ["Latte", "Bebidas", 1840, "Sube"],
    ["Café americano", "Bebidas", 1510, "Estable"],
    ["Croissant", "Panadería", 980, "Sube"],
    ["Té chai", "Bebidas", 760, "Sube"],
    ["Sándwich", "Alimentos", 630, "Baja"],
  ] as [string, string, number, string][],
  categories: [92, 66, 48],
  combos: [
    { name: "Latte + Croissant", beverage: "Latte", units: 720, price: 99, normalPrice: 110 },
    { name: "Café americano + Sándwich", beverage: "Café americano", units: 590, price: 126, normalPrice: 140 },
    { name: "Té chai + Croissant", beverage: "Té chai", units: 465, price: 108, normalPrice: 120 },
  ],
  inventory: [
    ["Café molido", "Americano, Latte", "185 kg", "740 kg", "Comprar"],
    ["Leche entera", "Latte, Té chai", "420 L", "1,680 L", "Ajustado por clima"],
    ["Hielo", "Bebidas frías", "310 kg", "1,240 kg", "Ajustado por clima"],
    ["Pan artesanal", "Sándwich", "240 u.", "960 u.", "En stock"],
    ["Mantequilla", "Croissant", "48 kg", "192 kg", "Comprar"],
  ],
  stockCoverage: [
    ["Café molido", "3.5 semanas", "Reponer pronto"],
    ["Leche entera", "2 semanas", "Revisar consumo"],
    ["Hielo", "4.5 semanas", "Cobertura suficiente"],
    ["Pan artesanal", "5 semanas", "Cobertura suficiente"],
    ["Mantequilla", "3 semanas", "Reponer pronto"],
  ],
  weather: {
    previous: "18 °C y lluvia",
    current: "27 °C y despejado",
    description: "subió la temperatura y se esperan tardes despejadas",
    date: "18 de junio",
    salesFactor: 1.3,
    originalProducts: [
      ["Café americano", 1510],
      ["Latte", 1840],
      ["Té chai", 760],
      ["Croissant", 980],
      ["Sándwich", 630],
    ] as [string, number][],
    adjustedProductNames: ["Latte", "Té chai"],
  },
  reports: {
    predicted: [68, 88, 72, 58],
    actual: [64, 84, 75, 55],
  },
  locations: [
    { name: "Tienda 1", zone: "Cancún · Zona Hotelera", sales: "$18,420", order: "485 kg", alerts: 1, star: "Latte" },
    { name: "Tienda 2", zone: "Cancún · Centro", sales: "$17,680", order: "520 kg", alerts: 2, star: "Café americano" },
    { name: "Tienda 3", zone: "Cancún · Puerto Cancún", sales: "$15,790", order: "475 kg", alerts: 0, star: "Té chai" },
  ],
  recipes: [
    { product: "Latte", ingredient: "Café molido", amount: 18 },
    { product: "Latte", ingredient: "Leche", amount: 220 },
    { product: "Sándwich", ingredient: "Pan", amount: 2 },
  ],
};
