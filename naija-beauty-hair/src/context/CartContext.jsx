import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'cyntress_cart'

function loadLocalCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setItems(loadLocalCart())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    saveLocalCart(items)
    if (user) {
      setDoc(doc(db, 'carts', user.uid), { items, updatedAt: new Date() }, { merge: true })
    }
  }, [items, user, loaded])

  const addItem = useCallback((variant, product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === variant.id)
      if (existing) {
        return prev.map(i =>
          i.variantId === variant.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, {
        variantId: variant.id,
        productId: product.id,
        productTitle: product.title,
        variantTitle: variant.title,
        image: product.images?.[0],
        price: variant.price,
        quantity,
        handle: product.handle,
      }]
    })
  }, [])

  const removeItem = useCallback((variantId) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId))
  }, [])

  const updateQuantity = useCallback((variantId, quantity) => {
    if (quantity < 1) return
    setItems(prev =>
      prev.map(i => i.variantId === variantId ? { ...i, quantity } : i)
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
