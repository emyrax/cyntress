import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { mainNav } from '../../data/navigation'
import MobileNav from './MobileNav'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const location = useLocation()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/" className="flex-1 md:flex-none text-center md:text-left">
              <span className="text-xl md:text-2xl font-serif font-bold text-gold tracking-tight">
                CYTRESS LUXURY
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {mainNav.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    to={item.path}
                    className={`text-xs font-semibold tracking-wider uppercase py-2 hover:text-gold transition-colors ${
                      location.pathname === item.path ? 'text-gold' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50">
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-gold hover:bg-gray-50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-gold transition-colors" aria-label="Search">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {user ? (
                <div className="relative group">
                  <button className="p-2 hover:text-gold transition-colors" aria-label="Account">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px] z-50">
                    <div className="py-2">
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:text-gold hover:bg-gray-50">Dashboard</Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-gold hover:bg-gray-50">Sign Out</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="p-2 hover:text-gold transition-colors" aria-label="Log in">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              <Link to="/cart" className="p-2 relative hover:text-gold transition-colors" aria-label="Cart">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gray-200 bg-white py-4 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
                  autoFocus
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold" onClick={() => setSearchOpen(false)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </>
  )
}
