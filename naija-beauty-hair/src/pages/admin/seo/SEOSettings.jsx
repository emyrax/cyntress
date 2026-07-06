import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { getDocument, addDocument, updateDocument, getDocuments } from '../../../firebase/firestore'
import { analyzeSEO } from '../../../utils/ai'
import { useToast } from '../../../components/ui/Toast'
import { friendlyError } from '../../../utils/errors'

const emptySettings = {
  siteTitle: 'Cyntress Luxury',
  siteDescription: 'Elevate Your Style with Premium Human Hair Wigs',
  ogImage: '',
  twitterHandle: '@cyntress',
  facebookPage: 'cyntress',
  favicon: '',
  googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  facebookPixelId: import.meta.env.VITE_FB_PIXEL_ID || '',
}

export default function SEOSettings() {
  const toast = useToast()
  const [settings, setSettings] = useState(emptySettings)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)

  useEffect(() => {
    getDocument('seo_settings', 'global')
      .then((doc) => {
        if (doc) setSettings({ ...emptySettings, ...doc })
      })
      .catch((err) => setFetchError(friendlyError(err)))
      .finally(() => setLoading(false))
  }, [])

  const update = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const existing = await getDocument('seo_settings', 'global')
      if (existing) {
        await updateDocument('seo_settings', 'global', settings)
      } else {
        await addDocument('seo_settings', { ...settings, id: 'global' })
      }
      setSaved(true)
      toast.success('Settings saved')
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
    } finally {
      setSaving(false)
    }
  }

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true)
    setAnalysisError(null)
    setAnalysis(null)
    try {
      const [products, blogs, pages] = await Promise.all([
        getDocuments('products'),
        getDocuments('blogs'),
        getDocuments('pages'),
      ])
      const result = await analyzeSEO(products, blogs, pages)
      setAnalysis(result)
    } catch (err) {
      const e = friendlyError(err)
      setAnalysisError(e.suggestion ? `${e.message} — ${e.suggestion}` : e.message)
    } finally {
      setAnalyzing(false)
    }
  }, [])

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />

  return (
    <>
      <Helmet><title>SEO Settings – Admin</title></Helmet>

      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">SEO Settings</h1>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
            <p>{fetchError.message}</p>
            {fetchError.suggestion && <p className="text-xs mt-1">{fetchError.suggestion}</p>}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">SEO Analyzer</h2>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-1.5 bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 px-4 py-2 text-sm font-medium rounded transition-colors disabled:opacity-50"
            >
              {analyzing ? '⟳ Analyzing...' : '✨ Run Site SEO Analysis'}
            </button>
          </div>

          {analysisError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm text-red-700">{analysisError}</div>
          )}

          {analysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{analysis.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Pages Analyzed</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className={`text-2xl font-bold ${analysis.healthScore >= 80 ? 'text-green-600' : analysis.healthScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {analysis.healthScore}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Health Score</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{analysis.highPriority}</p>
                  <p className="text-xs text-gray-500 mt-1">High Priority</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{analysis.mediumPriority}</p>
                  <p className="text-xs text-gray-500 mt-1">Medium Priority</p>
                </div>
              </div>

              {analysis.issues.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700">Issues Found ({analysis.issues.length})</h3>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {analysis.issues.slice(0, 20).map((issue, i) => (
                      <div key={i} className="px-4 py-2.5 flex items-start gap-3 text-sm">
                        <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${issue.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="text-gray-900 font-medium">{issue.item}</p>
                          <p className="text-gray-500 text-xs">Missing {issue.field} in {issue.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.recommendations && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Recommendations</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{analysis.recommendations}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* [Rest of form unchanged — keeps original settings fields] */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Global Meta Defaults</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
              <input type="text" value={settings.siteTitle} onChange={(e) => update('siteTitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              <p className="text-xs text-gray-500 mt-1">Appended to all page titles: "Page Title – {settings.siteTitle}"</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
              <textarea value={settings.siteDescription} onChange={(e) => update('siteDescription', e.target.value)} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none" />
              <p className="text-xs text-gray-500 mt-1">Default meta description for the homepage</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Image (default)</label>
              <input type="url" value={settings.ogImage} onChange={(e) => update('ogImage', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
              <input type="url" value={settings.favicon} onChange={(e) => update('favicon', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Social & Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Handle</label>
                <input type="text" value={settings.twitterHandle} onChange={(e) => update('twitterHandle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page</label>
                <input type="text" value={settings.facebookPage} onChange={(e) => update('facebookPage', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                <input type="text" value={settings.googleAnalyticsId} onChange={(e) => update('googleAnalyticsId', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                <input type="text" value={settings.facebookPixelId} onChange={(e) => update('facebookPixelId', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="bg-ink text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-ink-light transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && <span className="text-green-600 text-sm">Saved!</span>}
          </div>
        </form>
      </div>
    </>
  )
}
