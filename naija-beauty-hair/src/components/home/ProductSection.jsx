import { Link } from 'react-router-dom'
import ProductGrid from '../product/ProductGrid'

export default function ProductSection({ heading, products, loading, columns = 4, viewAllLink }) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">{heading}</h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-sm font-semibold uppercase tracking-wider text-gold hover:text-gold-light transition-colors">
              View All &rarr;
            </Link>
          )}
        </div>
        <ProductGrid products={products} loading={loading} columns={columns} />
      </div>
    </section>
  )
}
