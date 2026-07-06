import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPostBySlug } from '../firebase/firestore'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getPostBySlug(slug)
      .then(setPost)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-64 bg-gray-200 rounded" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Post Not Found</h2>
        <Link to="/blog" className="text-gold hover:underline">Back to Blog</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title} – Cyntress Luxury Blog</title>
        {post.excerpt && <meta name="description" content={post.excerpt} />}
      </Helmet>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-gold">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        <h1 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-3">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
          <span>{post.author || 'Cyntress Luxury'}</span>
          <span>·</span>
          <span>{post.publishedAt?.toDate?.().toLocaleDateString() || ''}</span>
        </div>

        {post.image && (
          <img src={post.image} alt={post.title} className="w-full aspect-video object-cover rounded-lg mb-8" />
        )}

        <div className="prose prose-gray prose-headings:font-serif max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link to="/blog" className="text-gold hover:underline text-sm font-medium">&larr; Back to Blog</Link>
        </div>
      </article>
    </>
  )
}
