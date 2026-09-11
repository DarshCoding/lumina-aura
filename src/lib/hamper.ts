import { roundMoney } from "./pricing";

export interface HamperOption {
  id: string;
  label: string;
  price: number;
  description?: string;
  /** Hex swatch for color options */
  swatch?: string;
}

/** Fragrance add-ons for the custom hamper */
export const FRAGRANCE_OPTIONS: HamperOption[] = [
  {
    id: "frag-sandalwood",
    label: "Sandalwood & Vanilla",
    price: 0,
    description: "Warm amber base — included with signature pours",
  },
  {
    id: "frag-jasmine",
    label: "Night Jasmine",
    price: 149,
    description: "Soft floral musk for evening rooms",
  },
  {
    id: "frag-cedar",
    label: "Cedar & Smoked Tea",
    price: 199,
    description: "Grounded woody profile",
  },
  {
    id: "frag-linen",
    label: "Linen Citrus",
    price: 129,
    description: "Clean, airy morning scent",
  },
  {
    id: "frag-cocoa",
    label: "Velvet Cocoa",
    price: 249,
    description: "Deep gourmand with soft spice",
  },
];

/** Vessel / wax color choices */
export const COLOR_OPTIONS: HamperOption[] = [
  {
    id: "color-ivory",
    label: "Ivory",
    price: 0,
    swatch: "#F5F0E8",
    description: "Natural unpigmented wax",
  },
  {
    id: "color-blush",
    label: "Blush",
    price: 99,
    swatch: "#E8C4B8",
    description: "Soft rose tint",
  },
  {
    id: "color-sage",
    label: "Sage",
    price: 99,
    swatch: "#A8B5A0",
    description: "Muted botanical green",
  },
  {
    id: "color-amber",
    label: "Amber Glow",
    price: 149,
    swatch: "#C4956A",
    description: "Warm honey tone",
  },
  {
    id: "color-ink",
    label: "Charcoal",
    price: 149,
    swatch: "#2C2C2C",
    description: "Matte deep charcoal vessel",
  },
];

/** Dried / fresh flower accompaniment */
export const FLOWER_OPTIONS: HamperOption[] = [
  {
    id: "flower-none",
    label: "No flowers",
    price: 0,
    description: "Candle and packaging only",
  },
  {
    id: "flower-lavender",
    label: "Dried lavender",
    price: 299,
    description: "A quiet botanical sprig",
  },
  {
    id: "flower-rose",
    label: "Preserved rose buds",
    price: 449,
    description: "Soft blush roses in tissue",
  },
  {
    id: "flower-eucalyptus",
    label: "Eucalyptus bundle",
    price: 349,
    description: "Fresh greenery for the box",
  },
  {
    id: "flower-mixed",
    label: "Seasonal mixed posy",
    price: 599,
    description: "Studio-selected seasonal blooms",
  },
];

/** Base gift-box packaging */
export const PACKAGING_BASE_FEE = 199;

/** Extra when a custom logo is applied to packaging */
export const LOGO_PACKAGING_FEE = 249;

export function findOption(
  options: HamperOption[],
  id: string
): HamperOption | undefined {
  return options.find((o) => o.id === id);
}

export interface HamperPriceInput {
  candlePrice: number;
  fragranceId: string;
  colorId: string;
  flowerId: string;
  hasLogo: boolean;
}

export interface HamperPriceBreakdown {
  candle: number;
  fragrance: number;
  color: number;
  flower: number;
  packaging: number;
  logo: number;
  total: number;
}

export function calculateHamperPrice(
  input: HamperPriceInput
): HamperPriceBreakdown {
  const fragrance = findOption(FRAGRANCE_OPTIONS, input.fragranceId)?.price ?? 0;
  const color = findOption(COLOR_OPTIONS, input.colorId)?.price ?? 0;
  const flower = findOption(FLOWER_OPTIONS, input.flowerId)?.price ?? 0;
  const packaging = PACKAGING_BASE_FEE;
  const logo = input.hasLogo ? LOGO_PACKAGING_FEE : 0;
  const candle = roundMoney(input.candlePrice);
  const total = roundMoney(
    candle + fragrance + color + flower + packaging + logo
  );

  return {
    candle,
    fragrance: roundMoney(fragrance),
    color: roundMoney(color),
    flower: roundMoney(flower),
    packaging: roundMoney(packaging),
    logo: roundMoney(logo),
    total,
  };
}
