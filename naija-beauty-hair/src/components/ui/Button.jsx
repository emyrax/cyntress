export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-ink text-white hover:bg-ink-light',
    secondary: 'bg-white text-gold border-2 border-gold hover:bg-ink-light hover:text-white',
    ghost: 'text-gold hover:bg-gray-100',
    gold: 'bg-gold text-white hover:bg-gold-light',
  }
  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
