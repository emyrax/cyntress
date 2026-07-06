import { createContext, useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const { isAdmin, loading, canAccess } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  const section = location.pathname.replace('/admin/', '').split('/')[0] || 'dashboard'

  if (section !== 'dashboard' && !canAccess(section)) {
    return <Navigate to="/admin" replace />
  }

  return (
    <AdminContext.Provider value={{ isAdmin, canAccess }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
