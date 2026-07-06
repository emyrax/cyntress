import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocuments, deleteDocument } from '../../../firebase/firestore'
import DataTable from '../../../components/admin/DataTable'
import { useToast } from '../../../components/ui/Toast'
import { friendlyError } from '../../../utils/errors'

export default function BannerList() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    getDocuments('banners')
      .then(setBanners)
      .catch((err) => setFetchError(friendlyError(err)))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this banner?')) return
    const prev = banners
    setBanners((p) => p.filter((b) => b.id !== id))
    try {
      await deleteDocument('banners', id)
      toast.success('Banner deleted')
    } catch (err) {
      setBanners(prev)
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
    }
  }

  const columns = [
    { key: 'image', label: 'Preview', render: (_, row) => (
      <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden">
        {row.desktopImage ? <img src={row.desktopImage} alt="" className="w-full h-full object-cover" /> : '-'}
      </div>
    )},
    { key: 'title', label: 'Title', sortable: true },
    { key: 'ctaText', label: 'CTA' },
    { key: 'order', label: 'Order', sortable: true },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/banners/${row.id}/edit`) }} className="text-xs text-gold hover:underline">Edit</button>
        <button onClick={(e) => handleDelete(row.id, e)} className="text-xs text-red-500 hover:underline">Delete</button>
      </div>
    )},
  ]

  const skeleton = (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}
    </div>
  )

  return (
    <>
      <Helmet><title>Banners – Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Banners</h1>
          <Link to="/admin/banners/new" className="bg-ink text-white px-4 py-2 text-sm font-medium rounded hover:bg-ink-light transition-colors">+ New Banner</Link>
        </div>
        {loading ? skeleton : <DataTable columns={columns} data={banners} error={fetchError} />}
      </div>
    </>
  )
}
