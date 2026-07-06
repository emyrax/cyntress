import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Link } from 'react-router-dom'

const defaultSlides = [
  {
    image: 'https://placehold.co/1920x600/1A1A1A/C9A84C?text=LUXURY+HUMAN+HAIR+WIG',
    title: 'LUXURY HUMAN HAIR WIG',
    subtitle: 'Elevate your style with premium quality',
    ctaText: 'SHOP NOW',
    ctaLink: '/collections/all',
  },
]

export default function HeroBanner({ slides }) {
  slides = slides ?? defaultSlides
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="w-full"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div
            className="relative h-[400px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 text-center px-4 max-w-3xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 tracking-tight">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl text-white/90 mb-8">{slide.subtitle}</p>
              )}
              <Link
                to={slide.ctaLink}
                className="inline-block bg-white text-gray-900 px-10 py-3.5 text-sm font-semibold uppercase tracking-widest hover:bg-ink-light hover:text-white transition-colors duration-300"
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
