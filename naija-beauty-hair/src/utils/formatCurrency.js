const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function tryFormat(amount) {
  try {
    const formatted = currencyFormatter.format(amount)
    if (formatted.includes('NGN')) return `₦${amount.toLocaleString()}`
    return formatted
  } catch {
    return `₦${amount.toLocaleString()}`
  }
}

export function formatCurrency(amount) {
  return tryFormat(amount)
}

export function formatPriceRange(min, max) {
  if (min === max) return formatCurrency(min)
  return `from ${formatCurrency(min)}`
}
