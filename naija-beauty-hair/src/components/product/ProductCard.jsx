import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import PriceDisplay from './PriceDisplay'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false)
  const { addItem } = useCart()

  const isSoldOut = product.variants?.every(v => !v.available) ?? false
  const isSale = product.compareAtPriceMin > product.priceMin
  const hasVariants = product.hasVariants ?? product.variants?.length > 1
  const mainImage = product.images?.[0]
  const hoverImage = product.images?.[1]

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isSoldOut || !product.variants?.length) return
    const variant = product.variants.find(v => v.available) || product.variants[0]
    addItem(variant, product)
  }

  return (
    <Link to={`/product/${product.handle}`} className="group block">
      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3">
        {imageError || !mainImage ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        ) : (
          <>
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={`${product.title} - hover`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onError={(e) => { e.target.style.display = 'none' }}
                loading="lazy"
              />
            )}
          </>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isSale && <Badge variant="sale">Sale</Badge>}
          {isSoldOut && <Badge variant="soldOut">Sold Out</Badge>}
        </div>

        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium py-2.5 rounded opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-ink-light hover:text-white"
        >
          {isSoldOut ? 'Sold Out' : hasVariants ? 'Select Options' : 'Add to Cart'}
        </button>
      </div>

      <h3 className="text-sm text-gray-800 font-medium leading-snug mb-1 line-clamp-2">
        {product.title}
      </h3>

      <PriceDisplay
        priceMin={product.priceMin}
        priceMax={product.priceMax}
        compareAtPriceMin={product.compareAtPriceMin}
        hasVariants={hasVariants}
      />
    </Link>
  )
}
