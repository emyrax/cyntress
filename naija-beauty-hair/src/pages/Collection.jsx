import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ProductGrid from '../components/product/ProductGrid'
import CountdownTimer from '../components/ui/CountdownTimer'
import { useCategoryProducts } from '../hooks/useProducts'

const categoryTitles = {
  'all': 'All Products',
  'wigs-on-sale': 'WIGS ON SALE',
  'glueless-wigs': 'Glueless Wigs',
  'bob-wig': 'Bob Wig',
  'straight-wig': 'Bone Straight Wigs',
  'raw-wavy-wig': 'Raw Wavy Wig',
  'original-curly-wig': 'Original Curly Wig',
  'fringe-wig': 'Fringe Wig',
  'short-cut-wig': 'Short Cut Wig',
  'headband-wig-1': 'Headband Wig',
  'hair-bundles': 'Hair Bundles',
  'wig-combo': 'Wig Combo',
  'undetectable-lace': 'Royal Lace',
  'new-in': 'New Arrivals',
  'hair-tools': 'Hair Tools',
}

export default function Collection() {
  const { slug = 'all' } = useParams()
  const category = slug === 'all' ? null : slug
  const { products, loading } = useCategoryProducts(category)
  const title = categoryTitles[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const isSalePage = slug === 'wigs-on-sale'

  return (
    <>
      <Helmet>
        <title>{title} – Cyntress Luxury</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">{title}</h1>
          {isSalePage && (
            <CountdownTimer targetDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()} />
          )}
        </div>

        <ProductGrid products={products} loading={loading} columns={4} />

        {!loading && products.length > 0 && (
          <div className="mt-12 text-center py-8 border-t border-gray-200">
            <h3 className="text-lg font-serif font-semibold text-gray-900 mb-2">Didn't find the wig/style you want?</h3>
            <p className="text-sm text-gray-500 mb-4">Tell us your idea and we'll make it real.</p>
            <a
              href="mailto:cynthiabeauty204@gmail.com?subject=Great%20Idea%20About%20New%20Wig"
              className="inline-block text-sm font-semibold uppercase tracking-wider text-gold hover:text-gold-light border-b-2 border-gold pb-0.5 transition-colors"
            >
              Send Us Your Idea &rarr;
            </a>
          </div>
        )}
      </div>
    </>
  )
}
