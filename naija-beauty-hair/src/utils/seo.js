export function generateMetaTitle(title, siteName = 'Cyntress Luxury') {
  return `${title} – ${siteName}`
}

export function truncateText(text, maxLength = 155) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.[0],
    sku: product.variants?.[0]?.sku,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'NGN',
      lowPrice: product.priceMin,
      highPrice: product.priceMax,
      availability: product.variants?.some(v => v.available)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }
}
