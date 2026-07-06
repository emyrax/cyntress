import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocument, addDocument, updateDocument } from '../../../firebase/firestore'
import MediaUploader from '../../../components/admin/MediaUploader'

const emptyBanner = {
  desktopImage: '',
  mobileImage: '',
  title: '',
  subtitle: '',
  ctaText: 'SHOP NOW',
  ctaLink: '/collections/all',
  order: 0,
}

export default function BannerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [banner, setBanner] = useState(emptyBanner)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getDocument('banners', id).then((doc) => {
      if (doc) setBanner({ ...emptyBanner, ...doc })
      setLoading(false)
    })
  }, [id, isEdit])

  const update = (field, value) => setBanner((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateDocument('banners', id, banner)
      } else {
        await addDocument('banners', banner)
      }
      navigate('/admin/banners')
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse h-48 bg-gray-200 rounded" />

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Banner' : 'New Banner'} – Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">{isEdit ? 'Edit Banner' : 'New Banner'}</h1>
          <button onClick={() => navigate('/admin/banners')} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Banner Content</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={banner.title} onChange={(e) => update('title', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" value={banner.subtitle} onChange={(e) => update('subtitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                <input type="text" value={banner.ctaText} onChange={(e) => update('ctaText', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input type="text" value={banner.ctaLink} onChange={(e) => update('ctaLink', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input type="number" value={banner.order} onChange={(e) => update('order', parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Images</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Image</label>
              <MediaUploader images={banner.desktopImage ? [banner.desktopImage] : []} onImagesChange={(imgs) => update('desktopImage', imgs[0] || '')} path="banners" maxFiles={1} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Image</label>
              <MediaUploader images={banner.mobileImage ? [banner.mobileImage] : []} onImagesChange={(imgs) => update('mobileImage', imgs[0] || '')} path="banners" maxFiles={1} />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-ink text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-ink-light transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Banner' : 'Create Banner'}
            </button>
            <button type="button" onClick={() => navigate('/admin/banners')} className="px-6 py-2.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </>
  )
}
