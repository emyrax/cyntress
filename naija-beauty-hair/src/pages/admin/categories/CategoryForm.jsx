import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocument, addDocument, updateDocument } from '../../../firebase/firestore'

const typeLabels = { product: 'Product', blog: 'Blog' }

const emptyCategory = {
  name: '',
  slug: '',
  type: '',
  order: 0,
}

export default function CategoryForm() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [category, setCategory] = useState({ ...emptyCategory, type })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getDocument('categories', id).then((doc) => {
      if (doc) setCategory({ ...emptyCategory, ...doc })
      setLoading(false)
    })
  }, [id, isEdit])

  const update = (field, value) => {
    setCategory((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'name' && !isEdit) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateDocument('categories', id, category)
      } else {
        await addDocument('categories', category)
      }
      navigate(`/admin/categories/${type}`)
    } catch (err) {
      alert('Error saving category: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const label = typeLabels[type] || 'Category'

  if (loading) return <div className="animate-pulse h-48 bg-gray-200 rounded" />

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit' : 'New'} {label} Category – Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">{isEdit ? 'Edit' : 'New'} {label} Category</h1>
          <button onClick={() => navigate(`/admin/categories/${type}`)} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back</button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={category.name} onChange={(e) => update('name', e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={category.slug} onChange={(e) => update('slug', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold bg-gray-50 text-gray-500" readOnly={!isEdit} />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from name. Edit after saving if needed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input type="number" value={category.order} onChange={(e) => update('order', parseInt(e.target.value) || 0)} min={0} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-ink text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-ink-light transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
            </button>
            <button type="button" onClick={() => navigate(`/admin/categories/${type}`)} className="px-6 py-2.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </>
  )
}
