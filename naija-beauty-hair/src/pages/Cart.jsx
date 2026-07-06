import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { addDocument } from '../firebase/firestore'
import { buildWhatsAppLink } from '../utils/whatsappMessage'
import OrderSummary from '../components/checkout/OrderSummary'

export default function Cart() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const handleWhatsAppOrder = async () => {
    if (!items.length) return
    setSubmitting(true)

    try {
      await addDocument('orders', {
        items,
        subtotal,
        customerId: user?.uid || null,
        customerEmail: user?.email || '',
        customerName: '',
        customerPhone: '',
        shippingAddress: {},
        notes: '',
        paymentMethod: 'whatsapp',
        paymentStatus: 'pending',
        status: 'pending',
      })

      const url = buildWhatsAppLink(items, subtotal)
      window.open(url, '_blank')
      clearCart()
    } catch {
      alert('Something went wrong. Please try again or contact us on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart – Cyntress Luxury</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <OrderSummary />
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Order</h3>
              <p className="text-xs text-gray-500 mb-4">
                We'll save your order and open WhatsApp with a pre-filled message including links to each product.
              </p>
              <button
                onClick={handleWhatsAppOrder}
                disabled={submitting || !items.length}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 text-sm font-semibold uppercase tracking-wider rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {submitting ? 'Processing...' : 'Order via WhatsApp'}
              </button>
              <p className="text-xs text-gray-400 mt-3 text-center">
                After ordering, share your delivery details on WhatsApp to confirm.
              </p>
            </div>
            <Link
              to="/collections/all"
              className="block text-center text-sm text-gold hover:text-gold-light font-medium"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
