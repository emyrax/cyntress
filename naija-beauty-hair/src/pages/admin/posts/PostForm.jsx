import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocument, addDocument, updateDocument } from '../../../firebase/firestore'
import MediaUploader from '../../../components/admin/MediaUploader'
import SEOFields from '../../../components/admin/SEOFields'

const emptyPost = {
  title: '',
  slug: '',
  category: '',
  image: '',
  content: '',
  excerpt: '',
  author: 'Cyntress Luxury',
  status: 'draft',
  publishedAt: null,
  seo: { title: '', description: '', ogImage: '', slug: '' },
}

const categories = [
  'wig-tips', 'hair-care', 'hairstyle', 'cyntress-media', 'product-spotlight', 'customer-reviews',
]

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [post, setPost] = useState(emptyPost)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getDocument('blogs', id).then((doc) => {
      if (doc) setPost({ ...emptyPost, ...doc, seo: doc.seo || emptyPost.seo })
      setLoading(false)
    })
  }, [id, isEdit])

  const update = (field, value) => {
    setPost((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'title' && !isEdit) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        updated.seo = { ...updated.seo, slug: updated.slug, title: value }
      }
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const data = {
      ...post,
      publishedAt: post.status === 'published' && !post.publishedAt ? new Date() : post.publishedAt,
    }

    try {
      if (isEdit) {
        await updateDocument('blogs', id, data)
      } else {
        await addDocument('blogs', data)
      }
      navigate('/admin/posts')
    } catch (err) {
      alert('Error saving post: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 rounded" />

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Post' : 'New Post'} – Admin</title></Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">{isEdit ? 'Edit Post' : 'New Post'}</h1>
          <button onClick={() => navigate('/admin/posts')} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Post Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={post.title} onChange={(e) => update('title', e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={post.category} onChange={(e) => update('category', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input type="text" value={post.author} onChange={(e) => update('author', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={post.status} onChange={(e) => update('status', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea value={post.excerpt} onChange={(e) => update('excerpt', e.target.value)} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea value={post.content} onChange={(e) => update('content', e.target.value)} rows={12} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-y font-mono text-xs" placeholder="Write your blog post content here..." />
              <p className="text-xs text-gray-500 mt-1">Plain text content. Each line becomes a paragraph.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Cover Image</h2>
            <MediaUploader
              images={post.image ? [post.image] : []}
              onImagesChange={(images) => update('image', images[0] || '')}
              path="blogs"
              maxFiles={1}
            />
          </div>

          <SEOFields seo={post.seo} onChange={(seo) => update('seo', seo)} />

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-ink text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-ink-light transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
            <button type="button" onClick={() => navigate('/admin/posts')} className="px-6 py-2.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </>
  )
}
