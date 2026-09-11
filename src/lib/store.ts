import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  Billing,
  BillingInput,
  GiftHamper,
  GiftHamperInput,
  Product,
  ProductInput,
  StoreData,
} from "./types";
import {
  calculateHamperPrice,
  COLOR_OPTIONS,
  findOption,
  FLOWER_OPTIONS,
  FRAGRANCE_OPTIONS,
  LOGO_PACKAGING_FEE,
  PACKAGING_BASE_FEE,
} from "./hamper";
import { roundMoney } from "./pricing";

const DATA_PATH = path.join(process.cwd(), "data", "store.json");

const IMAGE = {
  a: "/images/candle-1.svg",
  b: "/images/candle-1-b.svg",
  c: "/images/candle-2.svg",
  d: "/images/candle-2-b.svg",
  e: "/images/candle-3.svg",
  f: "/images/candle-3-b.svg",
  g: "/images/candle-4.svg",
  h: "/images/candle-4-b.svg",
  i: "/images/candle-5.svg",
  j: "/images/candle-5-b.svg",
  k: "/images/candle-6.svg",
  l: "/images/candle-6-b.svg",
};

const seedProducts: Product[] = [
  {
    id: "p-aurora",
    title: "Aurora Ember",
    description:
      "A soft amber glow with notes of sandalwood and warm vanilla. Hand-poured in small batches for a calm evening ritual.",
    code: "LA-AE-001",
    images: [IMAGE.a, IMAGE.b],
    price: 1899,
    discountPercent: 15,
    discountPrice: 1614,
    stock: 42,
    category: "Signature",
    scent: "Sandalwood · Vanilla",
    burnTime: "45 hours",
    featured: true,
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "p-nocturne",
    title: "Nocturne Bloom",
    description:
      "Night-blooming jasmine wrapped in soft musk. A quiet, luminous presence for late hours and reading corners.",
    code: "LA-NB-002",
    images: [IMAGE.c, IMAGE.d],
    price: 2199,
    discountPercent: 10,
    discountPrice: 1979,
    stock: 28,
    category: "Floral",
    scent: "Jasmine · Musk",
    burnTime: "50 hours",
    featured: true,
    createdAt: "2026-01-12T10:00:00.000Z",
    updatedAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "p-solstice",
    title: "Solstice Cedar",
    description:
      "Crisp cedarwood and smoked tea for grounded interiors. Designed for long, steady burns through winter evenings.",
    code: "LA-SC-003",
    images: [IMAGE.e, IMAGE.f],
    price: 2499,
    discountPercent: 0,
    discountPrice: 2499,
    stock: 18,
    category: "Woody",
    scent: "Cedar · Smoked Tea",
    burnTime: "55 hours",
    featured: true,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "p-linen",
    title: "Linen Hour",
    description:
      "Fresh linen and pale citrus — light, clean, and airy. Ideal for morning rituals and open studios.",
    code: "LA-LH-004",
    images: [IMAGE.g, IMAGE.h],
    price: 1599,
    discountPercent: 20,
    discountPrice: 1279,
    stock: 55,
    category: "Fresh",
    scent: "Linen · Citrus",
    burnTime: "40 hours",
    featured: false,
    createdAt: "2026-02-08T10:00:00.000Z",
    updatedAt: "2026-02-08T10:00:00.000Z",
  },
  {
    id: "p-velvet",
    title: "Velvet Ember",
    description:
      "Deep cocoa and soft spice in a matte vessel. A richer profile for intimate gatherings and cooler nights.",
    code: "LA-VE-005",
    images: [IMAGE.i, IMAGE.j],
    price: 2799,
    discountPercent: 12,
    discountPrice: 2463,
    stock: 14,
    category: "Gourmand",
    scent: "Cocoa · Spice",
    burnTime: "60 hours",
    featured: true,
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "p-mist",
    title: "Coastal Mist",
    description:
      "Sea salt, driftwood, and a whisper of bergamot. Evokes open windows and quiet shorelines.",
    code: "LA-CM-006",
    images: [IMAGE.k, IMAGE.l],
    price: 1999,
    discountPercent: 5,
    discountPrice: 1899,
    stock: 33,
    category: "Fresh",
    scent: "Sea Salt · Bergamot",
    burnTime: "48 hours",
    featured: false,
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
  },
];

function normalizeStore(data: Partial<StoreData>): StoreData {
  return {
    products: data.products ?? seedProducts,
    billings: data.billings ?? [],
    hampers: data.hampers ?? [],
  };
}

async function ensureDataFile(): Promise<StoreData> {
  const dir = path.dirname(DATA_PATH);
  await fs.mkdir(dir, { recursive: true });
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    const data = normalizeStore(parsed);
    if (!parsed.hampers) {
      await writeData(data);
    }
    return data;
  } catch {
    const data: StoreData = {
      products: seedProducts,
      billings: [],
      hampers: [],
    };
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    return data;
  }
}

async function writeData(data: StoreData) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function getStore(): Promise<StoreData> {
  return ensureDataFile();
}

export async function getProducts(): Promise<Product[]> {
  const store = await getStore();
  return store.products.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const store = await getStore();
  return store.products.find((p) => p.id === id);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const store = await getStore();
  const now = new Date().toISOString();
  const product: Product = {
    id: uuidv4(),
    ...input,
    discountPrice: roundMoney(input.discountPrice),
    discountPercent: roundMoney(input.discountPercent),
    price: roundMoney(input.price),
    stock: Math.max(0, Math.floor(input.stock)),
    createdAt: now,
    updatedAt: now,
  };
  store.products.push(product);
  await writeData(store);
  return product;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product | null> {
  const store = await getStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const existing = store.products[idx];
  const updated: Product = {
    ...existing,
    ...input,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  if (input.price !== undefined) updated.price = roundMoney(input.price);
  if (input.discountPercent !== undefined)
    updated.discountPercent = roundMoney(input.discountPercent);
  if (input.discountPrice !== undefined)
    updated.discountPrice = roundMoney(input.discountPrice);
  if (input.stock !== undefined)
    updated.stock = Math.max(0, Math.floor(input.stock));
  store.products[idx] = updated;
  await writeData(store);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const store = await getStore();
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === before) return false;
  await writeData(store);
  return true;
}

export async function setStock(
  id: string,
  stock: number
): Promise<Product | null> {
  const store = await getStore();
  const product = store.products.find((p) => p.id === id);
  if (!product) return null;
  product.stock = Math.max(0, Math.floor(stock));
  product.updatedAt = new Date().toISOString();
  await writeData(store);
  return product;
}

export async function getBillings(): Promise<Billing[]> {
  const store = await getStore();
  return store.billings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createBilling(input: BillingInput): Promise<Billing> {
  const store = await getStore();
  const items = [];
  let subtotal = 0;
  let discountTotal = 0;

  for (const line of input.items) {
    const product = store.products.find((p) => p.id === line.productId);
    if (!product) throw new Error(`Product not found: ${line.productId}`);
    if (product.stock < line.quantity) {
      throw new Error(`Insufficient stock for ${product.title}`);
    }
    const unitPrice = product.discountPrice;
    const lineTotal = roundMoney(unitPrice * line.quantity);
    const listLine = roundMoney(product.price * line.quantity);
    items.push({
      productId: product.id,
      productTitle: product.title,
      productCode: product.code,
      quantity: line.quantity,
      unitPrice,
      lineTotal,
    });
    subtotal += listLine;
    discountTotal += listLine - lineTotal;
    product.stock -= line.quantity;
    product.updatedAt = new Date().toISOString();
  }

  const total = roundMoney(subtotal - discountTotal);
  const count = store.billings.length + 1;
  const billing: Billing = {
    id: uuidv4(),
    invoiceNumber: `LA-${input.channel === "online" ? "ON" : "OFF"}-${String(count).padStart(4, "0")}`,
    channel: input.channel,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    items,
    subtotal: roundMoney(subtotal),
    discountTotal: roundMoney(discountTotal),
    total,
    notes: input.notes,
    createdAt: new Date().toISOString(),
  };

  store.billings.push(billing);
  await writeData(store);
  return billing;
}

export async function getHampers(): Promise<GiftHamper[]> {
  const store = await getStore();
  return store.hampers.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createHamper(
  input: GiftHamperInput
): Promise<GiftHamper> {
  const store = await getStore();
  const product = store.products.find((p) => p.id === input.candleProductId);
  if (!product) throw new Error("Candle not found");
  if (product.stock < 1) throw new Error(`${product.title} is out of stock`);

  const fragrance = findOption(FRAGRANCE_OPTIONS, input.fragranceId);
  const color = findOption(COLOR_OPTIONS, input.colorId);
  const flower = findOption(FLOWER_OPTIONS, input.flowerId);
  if (!fragrance) throw new Error("Invalid fragrance selection");
  if (!color) throw new Error("Invalid color selection");
  if (!flower) throw new Error("Invalid flower selection");

  const hasLogo = Boolean(input.logoUrl);
  const breakdown = calculateHamperPrice({
    candlePrice: product.discountPrice,
    fragranceId: fragrance.id,
    colorId: color.id,
    flowerId: flower.id,
    hasLogo,
  });

  product.stock -= 1;
  product.updatedAt = new Date().toISOString();

  const count = store.hampers.length + 1;
  const hamper: GiftHamper = {
    id: uuidv4(),
    reference: `LA-GH-${String(count).padStart(4, "0")}`,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    customerPhone: input.customerPhone?.trim() || undefined,
    candle: {
      productId: product.id,
      id: product.id,
      label: product.title,
      price: breakdown.candle,
    },
    fragrance: {
      id: fragrance.id,
      label: fragrance.label,
      price: breakdown.fragrance,
    },
    color: {
      id: color.id,
      label: color.label,
      price: breakdown.color,
    },
    flower: {
      id: flower.id,
      label: flower.label,
      price: breakdown.flower,
    },
    logoUrl: input.logoUrl || undefined,
    packagingFee: PACKAGING_BASE_FEE,
    logoFee: hasLogo ? LOGO_PACKAGING_FEE : 0,
    total: breakdown.total,
    notes: input.notes?.trim() || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  store.hampers.push(hamper);
  await writeData(store);
  return hamper;
}

export async function getDashboardStats() {
  const store = await getStore();
  const lowStock = store.products.filter((p) => p.stock <= 10);
  const totalStock = store.products.reduce((s, p) => s + p.stock, 0);
  const onlineSales = store.billings
    .filter((b) => b.channel === "online")
    .reduce((s, b) => s + b.total, 0);
  const offlineSales = store.billings
    .filter((b) => b.channel === "offline")
    .reduce((s, b) => s + b.total, 0);
  return {
    productCount: store.products.length,
    totalStock,
    lowStockCount: lowStock.length,
    billingCount: store.billings.length,
    hamperCount: store.hampers.length,
    onlineSales: roundMoney(onlineSales),
    offlineSales: roundMoney(offlineSales),
    totalSales: roundMoney(onlineSales + offlineSales),
    recentBillings: [...store.billings]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5),
    lowStock,
  };
}
