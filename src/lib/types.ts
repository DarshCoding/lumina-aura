export type SaleChannel = "online" | "offline";

export interface Product {
  id: string;
  title: string;
  description: string;
  code: string;
  images: string[];
  price: number;
  discountPercent: number;
  discountPrice: number;
  stock: number;
  category: string;
  scent?: string;
  burnTime?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingItem {
  productId: string;
  productTitle: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Billing {
  id: string;
  invoiceNumber: string;
  channel: SaleChannel;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: BillingItem[];
  subtotal: number;
  discountTotal: number;
  total: number;
  notes?: string;
  createdAt: string;
}

export type HamperStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";

export interface HamperSelection {
  id: string;
  label: string;
  price: number;
}

export interface GiftHamper {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  candle: HamperSelection & { productId: string };
  fragrance: HamperSelection;
  color: HamperSelection;
  flower: HamperSelection;
  logoUrl?: string;
  packagingFee: number;
  logoFee: number;
  total: number;
  notes?: string;
  status: HamperStatus;
  createdAt: string;
}

export interface GiftHamperInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  candleProductId: string;
  fragranceId: string;
  colorId: string;
  flowerId: string;
  logoUrl?: string;
  notes?: string;
}

export interface StoreData {
  products: Product[];
  billings: Billing[];
  hampers: GiftHamper[];
}

export interface ProductInput {
  title: string;
  description: string;
  code: string;
  images: string[];
  price: number;
  discountPercent: number;
  discountPrice: number;
  stock: number;
  category: string;
  scent?: string;
  burnTime?: string;
  featured: boolean;
}

export interface BillingInput {
  channel: SaleChannel;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: { productId: string; quantity: number }[];
  notes?: string;
}
