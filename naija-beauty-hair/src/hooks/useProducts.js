import { useState, useEffect } from 'react'
import { getFeaturedProducts, getProductsByCategory, getProducts } from '../firebase/firestore'

export function useFeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}

export function useCategoryProducts(category) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) {
      getProducts().then(setProducts).finally(() => setLoading(false))
    } else {
      getProductsByCategory(category)
        .then(setProducts)
        .finally(() => setLoading(false))
    }
  }, [category])

  return { products, loading }
}

export function useAllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then(setProducts).finally(() => setLoading(false))
  }, [])

  return { products, loading }
}
