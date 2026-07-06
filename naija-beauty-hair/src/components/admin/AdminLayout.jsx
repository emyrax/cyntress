import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminSidebar } from '../../data/navigation'

const iconMap = {
  LayoutDashboard: '📊',
  Package: '📦',
  FileText: '📝',
  Image: '🖼️',
  ShoppingCart: '🛒',
  Search: '🔍',
  File: '📄',
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <Link to="/admin" className="text-lg font-serif font-bold text-gold-light">
            Cyntress
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {adminSidebar.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-base">{iconMap[item.icon] || '📌'}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-1 truncate">{user?.email}</div>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
