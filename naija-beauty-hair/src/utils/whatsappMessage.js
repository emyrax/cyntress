const SITE_URL = 'https://cyntressluxury.com'
const WHATSAPP_NUMBER = '2349124449757'

export function buildWhatsAppLink(items, subtotal, customer = {}) {
  const lines = ['Hi, I\'d like to order from *Cyntress Luxury*', '', '*ORDER*', '──────────────────']

  items.forEach((item, i) => {
    const productUrl = `${SITE_URL}/product/${item.handle}`
    lines.push(
      `${i + 1}. ${item.productTitle}${item.variantTitle ? ` (${item.variantTitle})` : ''} × ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`,
      `   🔗 ${productUrl}`
    )
  })

  lines.push('──────────────────')
  lines.push(`*Total: ₦${subtotal.toLocaleString()}*`)

  if (customer.fullName || customer.email || customer.phone || customer.address) {
    lines.push('', '*MY DETAILS*')
    if (customer.fullName) lines.push(`Name: ${customer.fullName}`)
    if (customer.email) lines.push(`Email: ${customer.email}`)
    if (customer.phone) lines.push(`Phone: ${customer.phone}`)
    if (customer.address) lines.push(`Address: ${customer.address}${customer.city ? `, ${customer.city}` : ''}${customer.state ? `, ${customer.state}` : ''}`)
    if (customer.notes) lines.push('', `Notes: ${customer.notes}`)
  }

  lines.push('', '━━━━━━━━━━━━━━━━━', 'Ready to buy! Please confirm availability and I\'ll complete payment ✅')

  const text = encodeURIComponent(lines.join('\n'))
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`
}
