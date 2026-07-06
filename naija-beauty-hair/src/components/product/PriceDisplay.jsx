import { formatCurrency, formatPriceRange } from '../../utils/formatCurrency'

export default function PriceDisplay({ priceMin, priceMax, compareAtPriceMin, hasVariants }) {
  const showCompare = compareAtPriceMin && compareAtPriceMin > priceMin

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-base font-semibold text-gray-900">
          {hasVariants ? formatPriceRange(priceMin, priceMax) : formatCurrency(priceMin)}
        </span>
        {showCompare && (
          <span className="text-sm text-gray-400 line-through">
            {formatCurrency(compareAtPriceMin)}
          </span>
        )}
      </div>
      {showCompare && (
        <span className="text-xs text-green-600 font-medium">
          Save {formatCurrency(compareAtPriceMin - priceMin)}
        </span>
      )}
    </div>
  )
}
