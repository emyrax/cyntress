import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDocuments, deleteDocument } from '../../../firebase/firestore'
import DataTable from '../../../components/admin/DataTable'
import Badge from '../../../components/ui/Badge'
import { useToast } from '../../../components/ui/Toast'
import { friendlyError } from '../../../utils/errors'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    getDocuments('blogs')
      .then(setPosts)
      .catch((err) => setFetchError(friendlyError(err)))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, title, e) => {
    e.stopPropagation()
    if (!confirm(`Delete "${title}"?`)) return
    const prev = posts
    setPosts((p) => p.filter((b) => b.id !== id))
    try {
      await deleteDocument('blogs', id)
      toast.success('Post deleted')
    } catch (err) {
      setPosts(prev)
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
    }
  }

  const columns = [
    { key: 'image', label: 'Image', render: (_, row) => (
      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
        {row.image ? <img src={row.image} alt="" className="w-full h-full object-cover" /> : '-'}
      </div>
    )},
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'status', label: 'Status', render: (_, row) => (
      <Badge variant={row.status === 'published' ? 'published' : 'draft'}>{row.status || 'draft'}</Badge>
    )},
    { key: 'publishedAt', label: 'Date', sortable: true, render: (val) => val?.toDate?.()?.toLocaleDateString() || '-' },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/posts/${row.id}/edit`) }} className="text-xs text-gold hover:underline">Edit</button>
        <button onClick={(e) => handleDelete(row.id, row.title, e)} className="text-xs text-red-500 hover:underline">Delete</button>
      </div>
    )},
  ]

  const skeleton = (
    <div className="space-y-3">
      {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}
    </div>
  )

  return (
    <>
      <Helmet><title>Blog Posts – Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Blog Posts</h1>
          <Link to="/admin/posts/new" className="bg-ink text-white px-4 py-2 text-sm font-medium rounded hover:bg-ink-light transition-colors">+ New Post</Link>
        </div>
        {loading ? skeleton : (
          <DataTable columns={columns} data={posts} error={fetchError} searchable searchKeys={['title', 'category']} paginated pageSize={15} onRowClick={(row) => navigate(`/admin/posts/${row.id}/edit`)} />
        )}
      </div>
    </>
  )
}
