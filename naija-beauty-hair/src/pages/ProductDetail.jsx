import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getProductByHandle } from '../firebase/firestore'
import { useCart } from '../context/CartContext'
import Badge from '../components/ui/Badge'
import PriceDisplay from '../components/product/PriceDisplay'
import { formatCurrency } from '../utils/formatCurrency'
import { trackViewContent, trackAddToCart } from '../utils/tracking'

export default function ProductDetail() {
  const { handle } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!handle) return
    setLoading(true)
    getProductByHandle(handle)
      .then((doc) => {
        setProduct(doc)
        if (doc?.variants?.length) {
          const available = doc.variants.find(v => v.available) || doc.variants[0]
          setSelectedVariant(available)
        }
      })
      .finally(() => setLoading(false))
  }, [handle])

  useEffect(() => {
    if (product) {
      trackViewContent({ content_name: product.title, content_ids: [product.id], content_type: 'product' })
    }
  }, [product])

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return
    addItem(selectedVariant, product, quantity)
    trackAddToCart({ content_name: product.title, content_ids: [product.id], content_type: 'product', value: selectedVariant.price, currency: 'NGN' })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
        <Link to="/collections/all" className="text-gold hover:underline">Browse All Products</Link>
      </div>
    )
  }

  const isSoldOut = product.variants?.every(v => !v.available) ?? false
  const isSale = product.compareAtPriceMin > product.priceMin
  const hasVariants = product.hasVariants ?? product.variants?.length > 1

  return (
    <>
      <Helmet>
        <title>{product.title} – Cyntress Luxury</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collections/all" className="hover:text-gold">All Wigs</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-3">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
              {isSale && <Badge variant="sale" className="absolute top-3 left-3">Sale</Badge>}
              {isSoldOut && <Badge variant="soldOut" className="absolute top-3 left-3">Sold Out</Badge>}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 flex-shrink-0 rounded border-2 overflow-hidden ${
                      selectedImage === i ? 'border-gold' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">{product.title}</h1>
              {product.brand && <p className="text-sm text-gray-500 mt-1">{product.brand}</p>}
            </div>

            <PriceDisplay
              priceMin={selectedVariant?.price ?? product.priceMin}
              priceMax={product.priceMax}
              compareAtPriceMin={selectedVariant?.compareAtPrice ?? product.compareAtPriceMin}
              hasVariants={false}
            />

            {hasVariants && product.variants?.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size / Length</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={!v.available}
                      className={`px-4 py-2 text-sm border rounded transition-colors ${
                        selectedVariant?.id === v.id
                          ? 'border-gold bg-ink text-white'
                          : v.available
                          ? 'border-gray-300 hover:border-gold text-gray-700'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                      }`}
                    >
                      {v.title}
                      {v.price !== product.priceMin && (
                        <span className="block text-xs opacity-75">{formatCurrency(v.price)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isSoldOut || !selectedVariant}
                className={`flex-1 py-3 px-6 text-sm font-semibold uppercase tracking-wider rounded transition-colors ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-ink text-white hover:bg-ink-light'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSoldOut ? 'Sold Out' : added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>

            {product.description && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <a
                href={`https://api.whatsapp.com/send?phone=2349124449757&text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.title)}%20-%20https%3A%2F%2Fcyntressluxury.com%2Fproduct%2F${product.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
