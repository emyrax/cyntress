import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { query, where, orderBy, limit } from 'firebase/firestore'
import { getBlogPosts, getDocuments } from '../firebase/firestore'

export default function Blog() {
  const { category } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [catName, setCatName] = useState(null)

  useEffect(() => {
    setLoading(true)
    getBlogPosts(category || null)
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [category])

  useEffect(() => {
    if (!category) { setCatName(null); return }
    getDocuments('categories', [where('slug', '==', category), where('type', '==', 'blog'), limit(1)]).then((docs) => {
      setCatName(docs[0]?.name || null)
    })
  }, [category])

  const title = category ? (catName || category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())) : 'Blog'

  return (
    <>
      <Helmet>
        <title>{title} – Cyntress Luxury</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6">{title}</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-video bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug || post.id}`} className="group block">
                <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-3">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                  )}
                </div>
                <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-1">
                  {categoryNames[post.category] || post.category}
                </p>
                <h2 className="text-base font-semibold text-gray-900 group-hover:text-gold transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {post.publishedAt?.toDate?.().toLocaleDateString() || ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
