/** Round to 2 decimal places for currency */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * When discount % changes → recalculate discount price from list price.
 * When discount price changes → recalculate discount %.
 */
export function calcFromPercent(price: number, discountPercent: number) {
  const pct = Math.min(100, Math.max(0, discountPercent || 0));
  const discountPrice = roundMoney(price * (1 - pct / 100));
  return { discountPercent: roundMoney(pct), discountPrice };
}

export function calcFromDiscountPrice(price: number, discountPrice: number) {
  if (price <= 0) {
    return { discountPercent: 0, discountPrice: roundMoney(discountPrice || 0) };
  }
  const dp = Math.min(price, Math.max(0, discountPrice || 0));
  const discountPercent = roundMoney(((price - dp) / price) * 100);
  return { discountPercent, discountPrice: roundMoney(dp) };
}

export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
