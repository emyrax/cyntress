export default function SEOFields({ seo, onChange }) {
  const handleChange = (field, value) => {
    onChange?.({ ...seo, [field]: value })
  }

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">SEO</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Title
          <span className="text-gray-400 font-normal ml-1">({seo?.title?.length || 0}/60)</span>
        </label>
        <input
          type="text"
          value={seo?.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          maxLength={60}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
          placeholder="Leave empty to use default title"
        />
        {seo?.title && (
          <p className="mt-1 text-xs text-gray-500 truncate" title="Search result preview">
            Preview: {seo.title} – Cyntress Luxury
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Description
          <span className="text-gray-400 font-normal ml-1">({seo?.description?.length || 0}/160)</span>
        </label>
        <textarea
          value={seo?.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          maxLength={160}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none"
          placeholder="Brief description for search results"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">OG Image (optional)</label>
        <input
          type="url"
          value={seo?.ogImage || ''}
          onChange={(e) => handleChange('ogImage', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug / Handle</label>
        <input
          type="text"
          value={seo?.slug || ''}
          onChange={(e) => handleChange('slug', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold font-mono text-xs"
          placeholder="product-handle"
        />
      </div>
    </div>
  )
}
