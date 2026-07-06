import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register, resetPassword, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await register(email, password)
        setRegistered(true)
      } else {
        await login(email, password)
        navigate('/admin')
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setError('')
    setLoading(true)
    try {
      if (provider === 'google') await signInWithGoogle()
      else if (provider === 'facebook') await signInWithFacebook()
      else await signInWithApple()
      navigate('/')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim())
      }
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

  if (registered) {
    return (
      <>
        <Helmet>
          <title>Welcome – Cyntress Luxury</title>
        </Helmet>

        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to   { transform: scale(1); opacity: 1; }
          }
          @keyframes drawCheck {
            to { stroke-dashoffset: 0; }
          }
          .anim-scale-in {
            animation: scaleIn 0.5s ease-out forwards;
          }
          .anim-check {
            stroke-dasharray: 36;
            stroke-dashoffset: 36;
            animation: drawCheck 0.4s 0.3s ease-out forwards;
          }
        `}</style>

        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm text-center anim-scale-in">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline className="anim-check" points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              🎉 Welcome to Cyntress!
            </h1>
            <p className="text-gray-600 mb-1">
              Your admin account has been created successfully.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              You now have full access to manage products, orders, and your store.
            </p>

            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-ink text-white py-2.5 text-sm font-semibold uppercase tracking-wider rounded hover:bg-ink-light transition-colors"
            >
              Go to Dashboard
            </button>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                &larr; Back to Store
              </Link>
            </div>
          </div>
        </div>
      </>
    )
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

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">or</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 text-sm font-medium rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-2.5 text-sm font-medium rounded hover:bg-[#166fe5] transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-2.5 text-sm font-medium rounded hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="mt-6 text-center space-y-2 text-sm">
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
