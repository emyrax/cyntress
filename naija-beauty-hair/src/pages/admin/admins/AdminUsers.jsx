import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getDocuments, updateDocument } from '../../../firebase/firestore'
import DataTable from '../../../components/admin/DataTable'
import Badge from '../../../components/ui/Badge'
import { useAuth } from '../../../context/AuthContext'

const roleOptions = ['admin', 'editor']

const roleColors = {
  admin: 'bg-gold text-ink',
  editor: 'bg-gray-700 text-gray-200',
}

export default function AdminUsers() {
  const { user } = useAuth()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocuments('admins').then(setAdmins).finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (uid, role) => {
    await updateDocument('admins', uid, { role })
    setAdmins((prev) => prev.map((a) => (a.id === uid ? { ...a, role } : a)))
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

  return (
    <>
      <Helmet><title>Admin Users – Admin</title></Helmet>
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Admin Users</h1>
        <DataTable columns={columns} data={admins} searchable searchKeys={['email']} paginated pageSize={20} />
      </div>
    </>
  )
}