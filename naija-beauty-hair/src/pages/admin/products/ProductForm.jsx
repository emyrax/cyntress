import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocument, addDocument, updateDocument } from '../../../firebase/firestore'
import MediaUploader from '../../../components/admin/MediaUploader'
import SEOFields from '../../../components/admin/SEOFields'

const emptyProduct = {
  title: '',
  handle: '',
  description: '',
  category: '',
  tags: [],
  featured: false,
  featuredOrder: 0,
  brand: 'Cyntress Luxury',
  images: [],
  variants: [{ id: `v-${Date.now()}`, title: 'Default', price: 0, compareAtPrice: null, available: true, sku: '' }],
  priceMin: 0,
  priceMax: 0,
  compareAtPriceMin: null,
  hasVariants: false,
  seo: { title: '', description: '', ogImage: '', slug: '' },
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [product, setProduct] = useState(emptyProduct)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getDocument('products', id).then((doc) => {
      if (doc) {
        setProduct({
          ...emptyProduct,
          ...doc,
          seo: doc.seo || emptyProduct.seo,
          variants: doc.variants || emptyProduct.variants,
        })
      }
      setLoading(false)
    })
  }, [id, isEdit])

  const update = (field, value) => {
    setProduct((prev) => {
      const updated = { ...prev, [field]: value }

      if (field === 'title' && !isEdit) {
        updated.handle = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        updated.seo = { ...updated.seo, slug: updated.handle, title: value }
      }

      if (field === 'variants') {
        const prices = value.map((v) => v.price).filter((p) => p != null)
        updated.priceMin = Math.min(...prices)
        updated.priceMax = Math.max(...prices)
        updated.compareAtPriceMin = value.some((v) => v.compareAtPrice)
          ? Math.min(...value.map((v) => v.compareAtPrice || v.price))
          : null
        updated.hasVariants = value.length > 1
      }

      return updated
    })
  }

  const addVariant = () => {
    const newV = { id: `v-${Date.now()}`, title: '', price: 0, compareAtPrice: null, available: true, sku: '' }
    update('variants', [...product.variants, newV])
  }

  const updateVariant = (index, field, value) => {
    const variants = product.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    update('variants', variants)
  }

  const removeVariant = (index) => {
    if (product.variants.length <= 1) return
    update('variants', product.variants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const data = {
      ...product,
      updatedAt: new Date(),
    }

    try {
      if (isEdit) {
        await updateDocument('products', id, data)
      } else {
        await addDocument('products', data)
      }
      navigate('/admin/products')
    } catch (err) {
      alert('Error saving product: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded" />
  }

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Product' : 'New Product'} – Admin</title></Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={product.title}
                  onChange={(e) => update('title', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={product.category}
                  onChange={(e) => update('category', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">Select category</option>
                  <option value="glueless-wigs">Glueless Wigs</option>
                  <option value="bob-wig">Bob Wig</option>
                  <option value="straight-wig">Bone Straight Wigs</option>
                  <option value="raw-wavy-wig">Raw Wavy Wig</option>
                  <option value="original-curly-wig">Original Curly Wig</option>
                  <option value="fringe-wig">Fringe Wig</option>
                  <option value="short-cut-wig">Short Cut Wig</option>
                  <option value="headband-wig-1">Headband Wig</option>
                  <option value="hair-bundles">Hair Bundles</option>
                  <option value="wig-combo">Wig Combo</option>
                  <option value="undetectable-lace">Royal Lace</option>
                  <option value="new-in">New Arrivals</option>
                  <option value="hair-tools">Hair Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={product.brand}
                  onChange={(e) => update('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={(e) => update('featured', e.target.checked)}
                    className="rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  Featured
                </label>
                {product.featured && (
                  <div>
                    <label className="text-sm text-gray-600 mr-2">Order</label>
                    <input
                      type="number"
                      value={product.featuredOrder}
                      onChange={(e) => update('featuredOrder', parseInt(e.target.value) || 0)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={product.description}
                onChange={(e) => update('description', e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={product.tags?.join(', ') || ''}
                onChange={(e) => update('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                placeholder="sale, new, bestseller"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated tags</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Pricing & Variants</h2>

            <div className="space-y-3">
              {product.variants.map((variant, i) => (
                <div key={variant.id} className="flex items-end gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={variant.title}
                      onChange={(e) => updateVariant(i, 'title', e.target.value)}
                      placeholder='e.g. 16"'
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-gray-500 mb-1">Price (₦)</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(i, 'price', parseFloat(e.target.value) || 0)}
                      min={0}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-gray-500 mb-1">Compare At</label>
                    <input
                      type="number"
                      value={variant.compareAtPrice || ''}
                      onChange={(e) => updateVariant(i, 'compareAtPrice', e.target.value ? parseFloat(e.target.value) : null)}
                      min={0}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-gray-500 mb-1">SKU</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={variant.available}
                        onChange={(e) => updateVariant(i, 'available', e.target.checked)}
                        className="rounded border-gray-300 text-gold"
                      />
                      Available
                    </label>
                    {product.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600 text-xs">
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addVariant} className="text-sm text-gold hover:underline">
              + Add variant
            </button>

            <div className="text-xs text-gray-500">
              Price range: ₦{product.priceMin?.toLocaleString()} – ₦{product.priceMax?.toLocaleString()}
              {product.compareAtPriceMin && ` | Compare at: ₦${product.compareAtPriceMin?.toLocaleString()}`}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Images</h2>
            <MediaUploader
              images={product.images}
              onImagesChange={(images) => update('images', images)}
              path="products"
            />
          </div>

          <SEOFields
            seo={product.seo}
            onChange={(seo) => update('seo', seo)}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-ink text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-ink-light transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
