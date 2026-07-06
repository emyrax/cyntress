import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getDocuments, updateDocument } from '../../../firebase/firestore'
import DataTable from '../../../components/admin/DataTable'
import Badge from '../../../components/ui/Badge'

const statusOptions = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default function OrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocuments('orders').then(setOrders).finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id, status) => {
    await updateDocument('orders', id, { status })
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const columns = [
    { key: 'id', label: 'Order ID', render: (val) => <span className="font-mono text-xs">{val?.slice(0, 10)}...</span> },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'customerEmail', label: 'Email' },
    { key: 'subtotal', label: 'Total', sortable: true, render: (val) => `₦${(val || 0).toLocaleString()}` },
    { key: 'paymentStatus', label: 'Payment', render: (val) => (
      <Badge variant={val === 'paid' ? 'completed' : 'pending'}>{val || 'pending'}</Badge>
    )},
    { key: 'status', label: 'Status', render: (val, row) => (
      <select
        value={val || 'pending'}
        onChange={(e) => handleStatusChange(row.id, e.target.value)}
        className={`text-xs rounded px-2 py-1 border border-gray-300 ${statusColors[val] || ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    )},
    { key: 'createdAt', label: 'Date', sortable: true, render: (val) => val?.toDate?.()?.toLocaleDateString() || '-' },
  ]

  return (
    <>
      <Helmet><title>Orders – Admin</title></Helmet>
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Orders</h1>
        <DataTable columns={columns} data={orders} searchable searchKeys={['customerName', 'customerEmail', 'id']} paginated pageSize={20} />
      </div>
    </>
  )
}
