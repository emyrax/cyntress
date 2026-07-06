import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getDocument, addDocument, updateDocument } from '../../../firebase/firestore'
import SEOFields from '../../../components/admin/SEOFields'
import RichTextEditor from '../../../components/admin/RichTextEditor'
import AIButton from '../../../components/admin/AIButton'

const availablePages = [
  { slug: 'about', label: 'About Us' },
  { slug: 'how-to-order', label: 'How to Order' },
  { slug: 'faqs', label: 'FAQs' },
  { slug: 'contact', label: 'Contact Us' },
  { slug: 'shipment-policy', label: 'Shipment Policy' },
  { slug: 'return-policy', label: 'Return Policy' },
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Service' },
  { slug: 'ip-rights', label: 'Intellectual Property Rights' },
  { slug: 'share-rewards', label: 'Share For Rewards' },
]

export default function PageEditor() {
  const [selectedSlug, setSelectedSlug] = useState(availablePages[0].slug)
  const [page, setPage] = useState({ title: '', content: '', seo: { title: '', description: '', ogImage: '', slug: '' } })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLoading(true)
    getDocument('pages', selectedSlug).then((doc) => {
      if (doc) {
        setPage({ title: doc.title || '', content: doc.content || '', seo: doc.seo || { title: '', description: '', ogImage: '', slug: '' } })
      } else {
        setPage({ title: '', content: '', seo: { title: '', description: '', ogImage: '', slug: '' } })
      }
      setLoading(false)
    })
  }, [selectedSlug])

  const handleAIResult = (result, mode) => {
    if (mode === 'meta') {
      setPage((prev) => ({ ...prev, seo: { ...prev.seo, ...result } }))
    } else {
      setPage((prev) => ({ ...prev, content: result }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const existing = await getDocument('pages', selectedSlug)
      const data = { ...page, slug: selectedSlug }
      if (existing) {
        await updateDocument('pages', selectedSlug, data)
      } else {
        await addDocument('pages', data)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Helmet><title>Page Editor – Admin</title></Helmet>
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Page Editor</h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {availablePages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                selectedSlug === p.slug ? 'bg-ink text-white border-gold' : 'bg-white text-gray-700 border-gray-300 hover:border-gold'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="animate-pulse h-64 bg-gray-200 rounded" />
        ) : (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <input
                type="text"
                value={page.title}
                onChange={(e) => setPage((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Page title"
                className="w-full text-xl font-serif font-bold border-b border-gray-200 pb-2 focus:outline-none focus:border-gold"
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <AIButton modes={['enhance', 'sales', 'shorten']} fieldValue={page.content} contextTitle={page.title} onResult={handleAIResult} />
                </div>
                <RichTextEditor value={page.content} onChange={(v) => setPage((prev) => ({ ...prev, content: v }))} minHeight="400px" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">SEO</h2>
                <AIButton modes={['meta']} fieldValue={`${page.title}\n\n${page.content?.replace(/<[^>]*>/g, '').slice(0, 1000)}`} contextTitle={page.title} onResult={handleAIResult} />
              </div>
              <SEOFields
                seo={page.seo}
                onChange={(seo) => setPage((prev) => ({ ...prev, seo }))}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-ink text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-ink-light transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Page'}
              </button>
              {saved && <span className="text-green-600 text-sm">Saved!</span>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
