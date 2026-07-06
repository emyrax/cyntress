import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'
import { Link } from 'react-router-dom'

export default function OrderSummary() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Your cart is empty</p>
          <Link to="/collections/all" className="text-gold hover:underline text-sm mt-2 inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3 pt-3 first:pt-0">
                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                  {item.image && (
                    <img src={item.image} alt={item.productTitle} className="w-full h-full object-cover rounded" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.productTitle}</p>
                  {item.variantTitle && (
                    <p className="text-xs text-gray-500">{item.variantTitle}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.variantId, parseInt(e.target.value))}
                      className="text-xs border border-gray-300 rounded px-1 py-0.5"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
