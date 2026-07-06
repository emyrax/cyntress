import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mainNav } from '../../data/navigation'

export default function MobileNav({ onClose }) {
  const [expanded, setExpanded] = useState(null)

  const toggleExpand = (label) => {
    setExpanded(expanded === label ? null : label)
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-serif font-bold text-gold text-lg">Menu</span>
          <button onClick={onClose} className="p-1" aria-label="Close menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="py-2">
          {mainNav.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-gold hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                    <svg className={`w-4 h-4 transition-transform ${expanded === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expanded === item.label && (
                    <div className="bg-gray-50 py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          onClick={onClose}
                          className="block px-8 py-2.5 text-sm text-gray-600 hover:text-gold transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={onClose}
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-gold hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
