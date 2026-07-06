import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getDocument, addDocument, updateDocument } from '../../../firebase/firestore'

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
  const [settings, setSettings] = useState(emptySettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getDocument('seo_settings', 'global').then((doc) => {
      if (doc) setSettings({ ...emptySettings, ...doc })
      setLoading(false)
    })
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
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />

  return (
    <>
      <Helmet><title>SEO Settings – Admin</title></Helmet>

      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">SEO Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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
