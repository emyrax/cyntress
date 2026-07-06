import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocuments, deleteDocument } from '../../../firebase/firestore'
import { where, orderBy } from 'firebase/firestore'
import DataTable from '../../../components/admin/DataTable'
import { useToast } from '../../../components/ui/Toast'
import { friendlyError } from '../../../utils/errors'

const typeLabels = { product: 'Product Categories', blog: 'Blog Categories' }

export default function CategoryList() {
  const { type } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setFetchError(null)
    getDocuments('categories', [where('type', '==', type), orderBy('order', 'asc')])
      .then(setCategories)
      .catch((err) => setFetchError(friendlyError(err)))
      .finally(() => setLoading(false))
  }, [type])

  const handleDelete = async (id, name, e) => {
    e.stopPropagation()
    if (!confirm(`Delete category "${name}"?`)) return
    const prev = categories
    setCategories((p) => p.filter((c) => c.id !== id))
    try {
      await deleteDocument('categories', id)
      toast.success('Category deleted')
    } catch (err) {
      setCategories(prev)
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
    }
  }

  const label = typeLabels[type] || 'Categories'

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug' },
    { key: 'order', label: 'Order', sortable: true },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/categories/${type}/${row.id}/edit`) }} className="text-xs text-gold hover:underline">Edit</button>
        <button onClick={(e) => handleDelete(row.id, row.name, e)} className="text-xs text-red-500 hover:underline">Delete</button>
      </div>
    )},
  ]

  const skeleton = (
    <div className="space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}
    </div>
  )

  return (
    <>
      <Helmet><title>{label} – Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">{label}</h1>
          <Link to={`/admin/categories/${type}/new`} className="bg-ink text-white px-4 py-2 text-sm font-medium rounded hover:bg-ink-light transition-colors">+ New Category</Link>
        </div>
        {loading ? skeleton : <DataTable columns={columns} data={categories} error={fetchError} searchable searchKeys={['name', 'slug']} onRowClick={(row) => navigate(`/admin/categories/${type}/${row.id}/edit`)} />}
      </div>
    </>
  )
}
