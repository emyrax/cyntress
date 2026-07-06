import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found – Cyntress Luxury</title></Helmet>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-serif font-bold text-gold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <Link to="/" className="bg-ink text-white px-6 py-2.5 text-sm font-semibold uppercase rounded hover:bg-ink-light transition-colors">
          Back to Home
        </Link>
      </div>
    </>
  )
}
