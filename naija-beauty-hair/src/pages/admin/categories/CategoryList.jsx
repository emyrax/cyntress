import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocuments, deleteDocument } from '../../../firebase/firestore'
import { query, where, orderBy } from 'firebase/firestore'
import DataTable from '../../../components/admin/DataTable'

const typeLabels = { product: 'Product Categories', blog: 'Blog Categories' }

export default function CategoryList() {
  const { type } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getDocuments('categories', [where('type', '==', type), orderBy('order', 'asc')])
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [type])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this category?')) return
    await deleteDocument('categories', id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const label = typeLabels[type] || 'Categories'

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug' },
    { key: 'order', label: 'Order', sortable: true },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/categories/${type}/${row.id}/edit`) }} className="text-xs text-gold hover:underline">Edit</button>
        <button onClick={(e) => handleDelete(row.id, e)} className="text-xs text-red-500 hover:underline">Delete</button>
      </div>
    )},
  ]

  return (
    <>
      <Helmet><title>{label} – Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">{label}</h1>
          <Link to={`/admin/categories/${type}/new`} className="bg-ink text-white px-4 py-2 text-sm font-medium rounded hover:bg-ink-light transition-colors">+ New Category</Link>
        </div>
        <DataTable columns={columns} data={categories} searchable searchKeys={['name', 'slug']} onRowClick={(row) => navigate(`/admin/categories/${type}/${row.id}/edit`)} />
      </div>
    </>
  )
}
