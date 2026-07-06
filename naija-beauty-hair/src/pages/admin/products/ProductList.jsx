import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocuments, deleteDocument } from '../../../firebase/firestore'
import DataTable from '../../../components/admin/DataTable'
import Badge from '../../../components/ui/Badge'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getDocuments('products')
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this product?')) return
    await deleteDocument('products', id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const columns = [
    { key: 'image', label: 'Image', render: (_, row) => (
      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
        {row.images?.[0] ? <img src={row.images[0]} alt="" className="w-full h-full object-cover" /> : '-'}
      </div>
    )},
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'priceMin', label: 'Price', sortable: true, render: (val) => val ? `₦${val.toLocaleString()}` : '-' },
    { key: 'status', label: 'Status', render: (_, row) => {
      const allSold = row.variants?.every(v => !v.available)
      if (allSold) return <Badge variant="soldOut">Sold Out</Badge>
      return <Badge variant="published">Active</Badge>
    }},
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${row.id}/edit`) }}
          className="text-xs text-gold hover:underline"
        >
          Edit
        </button>
        <button
          onClick={(e) => handleDelete(row.id, e)}
          className="text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    )},
  ]

  return (
    <>
      <Helmet><title>Products – Cyntress Luxury Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Products</h1>
          <Link
            to="/admin/products/new"
            className="bg-ink text-white px-4 py-2 text-sm font-medium rounded hover:bg-ink-light transition-colors"
          >
            + Add Product
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={products}
          searchable
          searchKeys={['title', 'category']}
          paginated
          pageSize={15}
          onRowClick={(row) => navigate(`/admin/products/${row.id}/edit`)}
        />
      </div>
    </>
  )
}
