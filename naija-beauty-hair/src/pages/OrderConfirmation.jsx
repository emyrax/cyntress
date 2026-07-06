import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function OrderConfirmation() {
  const { orderId } = useParams()

  return (
    <>
      <Helmet><title>Order Confirmed – Cyntress Luxury</title></Helmet>

      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Order Submitted!</h1>
        <p className="text-gray-600 mb-2">
          Your order has been saved. We'll reach out on WhatsApp to confirm availability and payment.
        </p>
        {orderId && (
          <p className="text-xs text-gray-400 font-mono mb-6">
            Order ID: {orderId}
          </p>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-8">
          <p className="font-medium mb-1">📱 Next step</p>
          <p>Check your WhatsApp — a message with your order details has been opened in a new tab. Send it to complete your order.</p>
        </div>

        <Link
          to="/"
          className="inline-block bg-ink text-white px-8 py-3 text-sm font-semibold uppercase rounded hover:bg-ink-light transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </>
  )
}
