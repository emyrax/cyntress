import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocument } from '../firebase/firestore'

const fallback = {
  about: { title: 'About Us', content: 'Content coming soon.' },
  contact: { title: 'Contact Us', content: 'Email: cynthiabeauty204@gmail.com\nPhone: 09124449757\nWhatsApp: +2349124449757' },
  faqs: { title: 'FAQs', content: 'Frequently Asked Questions — coming soon.' },
  'shipment-policy': { title: 'Shipment Policy', content: 'Our shipment policy — coming soon.' },
  'return-policy': { title: 'Return Policy', content: 'Our return policy — coming soon.' },
  'privacy-policy': { title: 'Privacy Policy', content: 'Our privacy policy — coming soon.' },
  terms: { title: 'Terms of Service', content: 'Our terms of service — coming soon.' },
  'ip-rights': { title: 'Intellectual Property Rights', content: 'Information about intellectual property — coming soon.' },
  'share-rewards': { title: 'Share for Rewards', content: 'Our referral rewards program — coming soon.' },
}

export default function GenericPage() {
  const location = useLocation()
  const slug = location.pathname.replace(/^\//, '')
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getDocument('pages', slug).then((doc) => {
      setPage(doc || null)
      setLoading(false)
    })
  }, [slug])

  const fb = fallback[slug] || { title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), content: 'Page coming soon.' }
  const title = page?.title || fb.title
  const content = page?.content || fb.content

  return (
    <>
      <Helmet><title>{title} – Cyntress Luxury</title></Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ) : (
          <>
            <nav className="text-sm text-gray-500 mb-6">
              <Link to="/" className="hover:text-gold">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{title}</span>
            </nav>

            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">{title}</h1>

            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
              {content.split('\n').map((line, i) => (
                line ? <p key={i} className="mb-4">{line}</p> : <br key="i" />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
