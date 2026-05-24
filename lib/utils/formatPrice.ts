export function formatPrice(amount: number, currencyCode = "INR"): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return formatter.format(amount)
}

export function parsePaise(paise: number): number {
  return paise / 100
}