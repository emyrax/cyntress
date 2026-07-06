import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import HeroBanner from '../components/home/HeroBanner'
import ProductSection from '../components/home/ProductSection'
import MidPageBanner from '../components/home/MidPageBanner'
import { useFeaturedProducts } from '../hooks/useProducts'
import { getBanners } from '../firebase/firestore'

export default function Home() {
  const { products: featured, loading } = useFeaturedProducts()
  const [banners, setBanners] = useState(null)

  useEffect(() => {
    getBanners().then((docs) => {
      if (docs?.length) {
        const mapped = docs
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((d) => ({
            image: d.desktopImage || d.mobileImage || '',
            title: d.title || '',
            subtitle: d.subtitle || '',
            ctaText: d.ctaText || 'SHOP NOW',
            ctaLink: d.ctaLink || '/collections/all',
          }))
        setBanners(mapped)
      } else {
        setBanners(null)
      }
    })
  }, [])

  const mid = products => {
    const mid = Math.ceil(products.length / 2)
    return [products.slice(0, mid), products.slice(mid, mid + 4)]
  }

  const [set1, set2] = featured.length ? mid(featured) : [[], []]

  return (
    <>
      <Helmet>
        <title>Cyntress Luxury - Elevate Your Style with Premium Human Hair Wigs</title>
        <meta name="description" content="Explore Cyntress Luxury, your go-to wig brand in Nigeria. Discover premium human hair wigs including Bob Wigs, Curly Wigs, and Headband Wigs." />
      </Helmet>

      <HeroBanner slides={banners} />

      <ProductSection
        heading="Featured Products"
        products={set1}
        loading={loading}
        viewAllLink="/collections/all"
      />

      <MidPageBanner
        title="CAN'T WAIT TO GET IT NOW"
        ctaText="SHOP NOW"
        ctaLink="/collections/all"
      />

      <ProductSection
        heading="Best Sellers"
        products={set2}
        loading={loading}
        columns={set2.length >= 4 ? 4 : set2.length}
      />

      <MidPageBanner
        title="DEFINE MY STYLE"
        subtitle="Discover wigs that match your personality"
        ctaText="SHOP NOW"
        ctaLink="/collections/all"
      />
    </>
  )
}
