import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocument, addDocument, updateDocument, getDocuments } from '../../../firebase/firestore'
import { where, orderBy } from 'firebase/firestore'
import MediaUploader from '../../../components/admin/MediaUploader'
import SEOFields from '../../../components/admin/SEOFields'
import RichTextEditor from '../../../components/admin/RichTextEditor'
import AIButton from '../../../components/admin/AIButton'
import { useToast } from '../../../components/ui/Toast'
import { friendlyError } from '../../../utils/errors'

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

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const toast = useToast()
  const [post, setPost] = useState(emptyPost)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    getDocuments('categories', [where('type', '==', 'blog'), orderBy('order', 'asc')])
      .then(setCategories)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    getDocument('blogs', id)
      .then((doc) => {
        if (doc) setPost({ ...emptyPost, ...doc, seo: doc.seo || emptyPost.seo })
      })
      .catch((err) => {
        const e = friendlyError(err)
        toast.error(e.message, e.suggestion)
      })
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const update = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setPost((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'title' && !isEdit) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        updated.seo = { ...updated.seo, slug: updated.slug, title: value }
      }
      return updated
    })
  }

  const validate = () => {
    const errs = {}
    if (!post.title?.trim()) errs.title = 'Title is required'
    if (!post.content?.replace(/<[^>]*>/g, '').trim()) errs.content = 'Content is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAIResult = (result, mode) => {
    if (mode === 'meta') {
      update('seo', { ...post.seo, ...result })
    } else if (mode === 'excerpt') {
      update('excerpt', result)
    } else {
      update('content', result)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

    const data = {
      ...post,
      publishedAt: post.status === 'published' && !post.publishedAt ? new Date() : post.publishedAt,
    }

    try {
      if (isEdit) {
        await updateDocument('blogs', id, data)
        toast.success('Post updated')
      } else {
        await addDocument('blogs', data)
        toast.success('Post created')
      }
      navigate('/admin/posts')
    } catch (err) {
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
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
                <input type="text" value={post.title} onChange={(e) => update('title', e.target.value)} required className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${errors.title ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gold'}`} />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={post.category} onChange={(e) => update('category', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                <AIButton modes={['excerpt']} fieldValue={post.content} contextTitle={post.title} onResult={handleAIResult} />
              </div>
              <textarea value={post.excerpt} onChange={(e) => update('excerpt', e.target.value)} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Content *</label>
                <AIButton modes={['enhance', 'sales', 'shorten', 'grammar', 'seoRewrite']} fieldValue={post.content} contextTitle={post.title} onResult={handleAIResult} />
              </div>
              <RichTextEditor value={post.content} onChange={(v) => update('content', v)} minHeight="400px" />
              {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
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

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">SEO</h2>
              <AIButton modes={['meta']} fieldValue={`${post.title}\n\n${post.content?.replace(/<[^>]*>/g, '').slice(0, 1000)}`} contextTitle={post.title} onResult={handleAIResult} />
            </div>
            <SEOFields seo={post.seo} onChange={(seo) => update('seo', seo)} />
          </div>

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
