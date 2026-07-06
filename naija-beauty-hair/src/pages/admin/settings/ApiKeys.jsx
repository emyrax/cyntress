import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getDocuments, setDocument, deleteDocument, getDocument } from '../../../firebase/firestore'
import { useToast } from '../../../components/ui/Toast'
import { friendlyError } from '../../../utils/errors'

const PROVIDERS = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic Claude' },
]

export default function ApiKeys() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ provider: 'gemini', key: '', label: '' })
  const [saving, setSaving] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const toast = useToast()

  useEffect(() => { loadKeys() }, [])

  const loadKeys = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const docs = await getDocuments('apiKeys')
      setKeys(docs)
    } catch (err) {
      setFetchError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  const startEdit = async (provider) => {
    try {
      const doc = await getDocument('api_keys', provider)
      if (doc) {
        setForm({ provider: doc.id, key: '', label: doc.label || '' })
        setEditing(doc.id)
        setShowKey(false)
      }
    } catch (err) {
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
    }
  }

  const startNew = () => {
    setForm({ provider: 'gemini', key: '', label: '' })
    setEditing('new')
    setShowKey(false)
  }

  const cancel = () => {
    setEditing(null)
    setForm({ provider: 'gemini', key: '', label: '' })
    setShowKey(false)
  }

  const handleSave = async () => {
    if (!form.key?.trim()) {
      toast.warning('API key is required', 'Paste your API key before saving.')
      return
    }
    setSaving(true)
    try {
      const provider = editing === 'new' ? form.provider : editing
      await setDocument('api_keys', provider, {
        key: form.key.trim(),
        label: form.label || PROVIDERS.find(p => p.value === provider)?.label || provider,
        enabled: true,
      })
      toast.success('API key saved')
      cancel()
      await loadKeys()
    } catch (err) {
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (provider, label) => {
    if (!confirm(`Delete API key for "${label || provider}"?`)) return
    const prev = keys
    setKeys((p) => p.filter((k) => k.id !== provider))
    try {
      await deleteDocument('api_keys', provider)
      toast.success('API key removed')
    } catch (err) {
      setKeys(prev)
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
    }
  }

  const maskKey = (key) => {
    if (!key) return 'Not configured'
    if (key.length < 12) return key.slice(0, 4) + '••••'
    return key.slice(0, 6) + '••••' + key.slice(-4)
  }

  const skeleton = (
    <div className="space-y-3">
      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}
    </div>
  )

  if (loading) return skeleton

  return (
    <>
      <Helmet><title>API Keys – Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">API Keys</h1>
          {!editing && <button onClick={startNew} className="bg-ink text-white px-4 py-2 text-sm font-medium rounded hover:bg-ink-light transition-colors">+ Add Key</button>}
        </div>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
            <p>{fetchError.message}</p>
            {fetchError.suggestion && <p className="text-xs mt-1">{fetchError.suggestion}</p>}
          </div>
        )}

        {editing ? (
          <div className="max-w-lg bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              {editing === 'new' ? 'Add API Key' : 'Edit API Key'}
            </h2>

            {editing === 'new' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold">
                  {PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}

            {editing !== 'new' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input type="text" value={PROVIDERS.find(p => p.value === editing)?.label || editing} disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <div className="flex gap-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  placeholder={editing !== 'new' ? 'Leave blank to keep current key' : 'Paste your API key'}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-gold"
                />
                <button type="button" onClick={() => setShowKey(!showKey)} className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Stored in Firestore. Visible only to admins.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="bg-ink text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-ink-light transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Key'}
              </button>
              <button onClick={cancel} className="px-6 py-2.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {PROVIDERS.map((provider) => {
              const stored = keys.find(k => k.id === provider.value)
              const hasKey = stored?.key
              return (
                <div key={provider.value} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{provider.label}</p>
                      <p className="text-xs font-mono text-gray-500 mt-0.5">
                        {hasKey ? maskKey(stored.key) : <span className="text-gray-400 italic">Not configured</span>}
                      </p>
                    </div>
                    {hasKey && <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-green-100 text-green-700">Active</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(provider.value)} className="text-xs text-gold hover:underline">
                      {hasKey ? 'Edit' : 'Add Key'}
                    </button>
                    {hasKey && <button onClick={() => handleDelete(provider.value, provider.label)} className="text-xs text-red-500 hover:underline">Remove</button>}
                  </div>
                </div>
              )
            })}

            {keys.filter(k => !PROVIDERS.find(p => p.value === k.id)).map((custom) => (
              <div key={custom.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{custom.label || custom.id}</p>
                  <p className="text-xs font-mono text-gray-500 mt-0.5">{maskKey(custom.key)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(custom.id)} className="text-xs text-gold hover:underline">Edit</button>
                  <button onClick={() => handleDelete(custom.id, custom.label)} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
