import { useEffect } from 'react'

const MARKETING_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'utm_term', 'fbclid', 'gclid',
]

export function useMarketingParams() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const data = {}
    for (const key of MARKETING_KEYS) {
      const val = params.get(key)
      if (val) data[key] = val
    }
    if (Object.keys(data).length > 0) {
      sessionStorage.setItem('marketing_data', JSON.stringify(data))
    }
  }, [])
}

export function getMarketingData() {
  try {
    const raw = sessionStorage.getItem('marketing_data')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
