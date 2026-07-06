import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

const collections = {
  products: () => collection(db, 'products'),
  categories: () => collection(db, 'categories'),
  banners: () => collection(db, 'banners'),
  blogs: () => collection(db, 'blogs'),
  orders: () => collection(db, 'orders'),
  newsletters: () => collection(db, 'newsletter_subscribers'),
  admins: () => collection(db, 'admins'),
  seoSettings: () => collection(db, 'seo_settings'),
  pages: () => collection(db, 'pages'),
}

export async function getDocument(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getDocuments(collectionName, constraints = []) {
  const q = query(collections[collectionName](), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addDocument(collectionName, data) {
  const ref = await addDoc(collections[collectionName](), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateDocument(collectionName, id, data) {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteDocument(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id))
}

export async function getProducts(constraints = []) {
  const defaults = [orderBy('createdAt', 'desc')]
  return getDocuments('products', [...defaults, ...constraints])
}

export async function getProductsByCategory(category, constraints = []) {
  return getDocuments('products', [
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
    ...constraints,
  ])
}

export async function getFeaturedProducts(constraints = []) {
  return getDocuments('products', [
    where('featured', '==', true),
    orderBy('featuredOrder', 'asc'),
    ...constraints,
  ])
}

export async function getBanners() {
  return getDocuments('banners', [orderBy('order', 'asc')])
}

export async function getBlogPosts(categorySlug = null, constraints = []) {
  const base = categorySlug
    ? [where('category', '==', categorySlug), orderBy('publishedAt', 'desc')]
    : [orderBy('publishedAt', 'desc')]
  return getDocuments('blogs', [...base, ...constraints])
}

export async function getCategories() {
  return getDocuments('categories', [orderBy('order', 'asc')])
}

export async function getSEOSettings() {
  return getDocument('seo_settings', 'global')
}

export async function getProductByHandle(handle) {
  const docs = await getDocuments('products', [where('handle', '==', handle), limit(1)])
  return docs.length > 0 ? docs[0] : null
}

export async function getPostBySlug(slug) {
  const docs = await getDocuments('blogs', [where('slug', '==', slug), limit(1)])
  return docs.length > 0 ? docs[0] : null
}

export async function getPage(slug) {
  const docs = await getDocuments('pages', [where('slug', '==', slug), limit(1)])
  return docs.length > 0 ? docs[0] : null
}

export async function submitNewsletter(email, source = 'footer') {
  return addDocument('newsletters', { email, source, subscribedAt: Timestamp.now() })
}

export { Timestamp, serverTimestamp }
