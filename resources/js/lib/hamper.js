import { roundMoney } from "./pricing";

export function findOption(options, id) {
  return options.find((o) => o.id === id);
}

export function calculateHamperPrice(input) {
  const fragrance = findOption(input.fragrances ?? [], input.fragranceId)?.price ?? 0;
  const color = findOption(input.colors ?? [], input.colorId)?.price ?? 0;
  const flower = findOption(input.flowers ?? [], input.flowerId)?.price ?? 0;
  const packaging = input.packagingFee ?? 0;
  const logo = input.hasLogo ? (input.logoFee ?? 0) : 0;
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
