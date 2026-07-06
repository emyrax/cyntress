import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'error', options = {}) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, suggestion: options.suggestion, duration: options.duration || 5000 }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, options.duration || 5000)
  }, [])

  const toast = {
    error: (message, suggestion) => addToast(message, 'error', { suggestion }),
    success: (message) => addToast(message, 'success'),
    warning: (message, suggestion) => addToast(message, 'warning', { suggestion }),
    info: (message) => addToast(message, 'info'),
  }

  const typeStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border p-3 text-sm shadow-lg animate-slide-up ${typeStyles[t.type] || typeStyles.info}`}
          >
            <p>{t.message}</p>
            {t.suggestion && <p className="text-xs mt-1 opacity-80">{t.suggestion}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
