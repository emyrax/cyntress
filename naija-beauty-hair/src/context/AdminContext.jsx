import { createContext, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const { isAdmin, loading } = useAuth()

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

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
