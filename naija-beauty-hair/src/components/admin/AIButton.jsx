import { useState, useRef, useEffect } from 'react'
import { enhanceText, generateMetaTags, generateExcerpt } from '../../utils/ai'

const MODE_LABELS = {
  enhance: 'Enhance',
  sales: 'Sales Rewrite',
  urgency: 'Add Urgency',
  promo: 'Promo Blurb',
  seoRewrite: 'SEO Rewrite',
  shorten: 'Shorten',
  grammar: 'Fix Grammar',
  excerpt: 'Generate Excerpt',
  meta: 'Auto Meta Tags',
}

export default function AIButton({
  modes = ['enhance'],
  fieldValue = '',
  contextTitle = '',
  onResult,
  className = '',
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleAction = async (mode) => {
    setLoading(true)
    setError(null)
    setOpen(false)
    try {
      let result
      if (mode === 'meta') {
        result = await generateMetaTags(contextTitle, fieldValue)
      } else if (mode === 'excerpt') {
        result = await generateExcerpt(fieldValue)
      } else {
        result = await enhanceText(fieldValue, mode)
      }
      onResult(result, mode)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(null), 4000)
    } finally {
      setLoading(false)
    }
  }

  if (modes.length === 0) return null

  const baseClass = `inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded transition-colors border ${className}`

  if (loading) {
    return (
      <span className={`${baseClass} bg-gray-100 text-gray-400 border-gray-200 cursor-wait`}>
        ⟳ Thinking...
      </span>
    )
  }

  if (error) {
    return (
      <span className={`${baseClass} bg-red-50 text-red-600 border-red-200`} title={error}>
        ✨ AI Error
      </span>
    )
  }

  if (modes.length === 1) {
    const mode = modes[0]
    return (
      <button type="button" onClick={() => handleAction(mode)} className={`${baseClass} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}>
        ✨ {MODE_LABELS[mode] || mode}
      </button>
    )
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)} className={`${baseClass} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}>
        ✨ AI {open ? '▲' : '▾'}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[170px] py-1">
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleAction(mode)}
              className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              {MODE_LABELS[mode] || mode}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
