import ProductCard from './ProductCard'
import { ProductGridSkeleton } from '../ui/Skeleton'

export default function ProductGrid({ products, loading, columns = 4 }) {
  if (loading) return <ProductGridSkeleton count={columns} />

  if (!products?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No products found.</p>
      </div>
    )
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
