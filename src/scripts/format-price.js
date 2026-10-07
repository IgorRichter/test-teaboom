export function formatPrice(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "";
  }

  const fractionDigits = Number.isInteger(amount) ? 0 : 2;

  return `${new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2,
  }).format(amount)}\u00A0₽`;
}

export function getDiscountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round((1 - price / oldPrice) * 100);
}
