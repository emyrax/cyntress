import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getDocuments, updateDocument } from '../../../firebase/firestore'
import DataTable from '../../../components/admin/DataTable'
import Badge from '../../../components/ui/Badge'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../components/ui/Toast'
import { friendlyError } from '../../../utils/errors'

const roleOptions = ['admin', 'editor']

const roleColors = {
  admin: 'bg-gold text-ink',
  editor: 'bg-gray-700 text-gray-200',
}

export default function AdminUsers() {
  const { user } = useAuth()
  const toast = useToast()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    getDocuments('admins')
      .then(setAdmins)
      .catch((err) => setFetchError(friendlyError(err)))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (uid, newRole) => {
    const prev = admins
    setAdmins((a) => a.map((x) => (x.id === uid ? { ...x, role: newRole } : x)))
    try {
      await updateDocument('admins', uid, { role: newRole })
      toast.success('Role updated')
    } catch (err) {
      setAdmins(prev)
      const e = friendlyError(err)
      toast.error(e.message, e.suggestion)
    }
  }

  const columns = [
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val, row) => {
        if (row.id === user?.uid) {
          return <Badge variant="default">{val}</Badge>
        }
        return (
          <select
            value={val || 'editor'}
            onChange={(e) => handleRoleChange(row.id, e.target.value)}
            className={`text-xs rounded px-2 py-1 border border-gray-300 ${roleColors[val] || ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (val) => {
        if (!val) return '-'
        const date = val.toDate ? val.toDate() : new Date(val)
        return date.toLocaleDateString()
      },
    },
  ]

  const skeleton = (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}
    </div>
  )

  return (
    <>
      <Helmet><title>Admin Users – Admin</title></Helmet>
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Admin Users</h1>
        {loading ? skeleton : <DataTable columns={columns} data={admins} error={fetchError} searchable searchKeys={['email']} paginated pageSize={20} />}
      </div>
    </>
  )
}
