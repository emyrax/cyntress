import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getDocuments } from '../../firebase/firestore'
import { friendlyError } from '../../utils/errors'

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, subscribers: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    Promise.all([
      getDocuments('products'),
      getDocuments('orders'),
      getDocuments('newsletters'),
    ])
      .then(([products, orders, newsletters]) => {
        const totalRevenue = orders
          .filter(o => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + (o.subtotal || 0), 0)

        setStats({
          products: products.length,
          orders: orders.length,
          revenue: totalRevenue,
          subscribers: newsletters.length,
        })

        setRecentOrders(
          orders
            .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
            .slice(0, 5)
        )
      })
      .catch((err) => setFetchError(friendlyError(err)))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Products', value: stats.products, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.orders, color: 'bg-green-500' },
    { label: 'Revenue', value: `₦${(stats.revenue / 100).toLocaleString()}`, color: 'bg-ink' },
    { label: 'Subscribers', value: stats.subscribers, color: 'bg-purple-500' },
  ]

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (fetchError) {
    return (
      <>
        <Helmet><title>Dashboard – Cyntress Luxury Admin</title></Helmet>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-sm text-red-700 font-medium">{fetchError.message}</p>
          {fetchError.suggestion && <p className="text-xs text-red-500 mt-1">{fetchError.suggestion}</p>}
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>Dashboard – Cyntress Luxury Admin</title></Helmet>

      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${loading ? 'animate-pulse bg-gray-200 h-8 w-20 rounded' : 'text-gray-900'}`}>
                {loading ? '' : card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {loading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-200 rounded" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase text-gray-500">Order</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase text-gray-500">Customer</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase text-gray-500">Total</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase text-gray-500">Status</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase text-gray-500">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-mono text-xs">{order.id?.slice(0, 8)}...</td>
                      <td className="py-2 px-3">{order.customerEmail || order.customerName || '-'}</td>
                      <td className="py-2 px-3">₦{(order.subtotal || 0).toLocaleString()}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.paymentStatus] || 'bg-gray-100'}`}>
                          {order.paymentStatus || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
