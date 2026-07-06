import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await register(email, password)
      } else {
        await login(email, password)
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!email) return setError('Enter your email first')
    try {
      await resetPassword(email)
      setResetSent(true)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Helmet>
        <title>{isRegister ? 'Register' : 'Log In'} – Cyntress Luxury</title>
      </Helmet>

      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-serif font-bold text-center text-gray-900 mb-8">
            {isRegister ? 'Create Account' : 'Log In'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {resetSent && <p className="text-sm text-green-600">Password reset email sent.</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white py-2.5 text-sm font-semibold uppercase tracking-wider rounded hover:bg-ink-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : isRegister ? 'Register' : 'Log In'}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2 text-sm">
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-gold hover:underline"
            >
              {isRegister ? 'Already have an account? Log In' : "Don't have an account? Register"}
            </button>
            {!isRegister && (
              <div>
                <button onClick={handleReset} className="text-gray-500 hover:text-gray-700 text-xs">
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Store</Link>
          </div>
        </div>
      </div>
    </>
  )
}
