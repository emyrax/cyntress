const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID

export function initFacebookPixel() {
  if (typeof window === 'undefined' || !FB_PIXEL_ID) return
  if (window.fbq) return

  ;(function(f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = true
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

  window.fbq('init', FB_PIXEL_ID)
  window.fbq('track', 'PageView')
}

export function trackViewContent(content) {
  if (window.fbq) {
    window.fbq('track', 'ViewContent', content)
  }
}

export function trackAddToCart(data) {
  if (window.fbq) {
    window.fbq('track', 'AddToCart', data)
  }
}

export function trackPurchase(data) {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_ID}/839eCOqVjYcZEKnXktoq`,
      value: data.value,
      currency: 'NGN',
      transaction_id: data.transactionId,
    })
  }
  if (window.fbq) {
    window.fbq('track', 'Purchase', { value: data.value, currency: 'NGN' })
  }
}
