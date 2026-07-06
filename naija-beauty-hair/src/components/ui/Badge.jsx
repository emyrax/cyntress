export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-800 text-white',
    sale: 'bg-red-600 text-white',
    soldOut: 'bg-gray-500 text-white',
    new: 'bg-green-600 text-white',
    draft: 'bg-yellow-500 text-white',
    published: 'bg-green-600 text-white',
    pending: 'bg-yellow-500 text-black',
    completed: 'bg-green-600 text-white',
    cancelled: 'bg-red-600 text-white',
  }

  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}
