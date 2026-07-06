import { Link } from 'react-router-dom'

export default function MidPageBanner({
  image = 'https://placehold.co/1920x500/1A1A1A/C9A84C?text=Cyntress+Luxury',
  title,
  subtitle,
  ctaText = 'SHOP NOW',
  ctaLink = '/collections/all',
}) {
  return (
    <section
      className="relative h-[300px] md:h-[400px] bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {title && (
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-base md:text-lg text-white/80 mb-6 max-w-xl">{subtitle}</p>
        )}
        <Link
          to={ctaLink}
          className="inline-block bg-white text-gray-900 px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-ink-light hover:text-white transition-colors duration-300"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  )
}
