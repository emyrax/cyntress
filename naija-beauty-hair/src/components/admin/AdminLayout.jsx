import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminSidebar } from '../../data/navigation'

const iconMap = {
  LayoutDashboard: '📊',
  Package: '📦',
  FileText: '📝',
  Tags: '🏷️',
  Image: '🖼️',
  ShoppingCart: '🛒',
  Key: '🔑',
  Search: '🔍',
  File: '📄',
  Users: '👤',
}

export default function AdminLayout() {
  const { user, logout, role } = useAuth()
  const location = useLocation()

  const visibleItems = adminSidebar.filter((item) =>
    item.roles ? item.roles.includes(role) : true
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <Link to="/admin" className="text-lg font-serif font-bold text-gold-light">
            Cyntress
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {visibleItems.map((item) => {
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

        <div className="p-4 border-t border-gray-800 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 truncate flex-1">{user?.email}</span>
            <span className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded ${
              role === 'admin' ? 'bg-gold text-ink' : 'bg-gray-700 text-gray-300'
            }`}>
              {role}
            </span>
          </div>
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
