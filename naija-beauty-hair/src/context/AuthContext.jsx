import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getDocument } from '../firebase/firestore'

const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'products', 'posts', 'banners', 'orders', 'seo', 'pages', 'admins'],
  editor: ['dashboard', 'products', 'posts'],
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const profile = await getDocument('admins', firebaseUser.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  async function ensureAdminProfile(firebaseUser) {
    const existing = await getDocument('admins', firebaseUser.uid)
    if (!existing) {
      await setDoc(doc(db, 'admins', firebaseUser.uid), {
        role: 'customer',
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        createdAt: new Date(),
      })
    }
  }

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const register = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, 'admins', cred.user.uid), { role: 'admin', email, createdAt: new Date() })
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const result = await signInWithPopup(auth, provider)
    await ensureAdminProfile(result.user)
    return result.user
  }

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider()
    const result = await signInWithPopup(auth, provider)
    await ensureAdminProfile(result.user)
    return result.user
  }

  const signInWithApple = async () => {
    const provider = new OAuthProvider('apple.com')
    const result = await signInWithPopup(auth, provider)
    await ensureAdminProfile(result.user)
    return result.user
  }

  const logout = () => signOut(auth)

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email)

  const role = userProfile?.role || null
  const isAdmin = role === 'admin' || role === 'editor'
  const permissions = useMemo(() => ROLE_PERMISSIONS[role] || [], [role])

  const canAccess = (section) => permissions.includes(section)

  return (
    <AuthContext.Provider value={{ user, userProfile, role, loading, login, register, signInWithGoogle, signInWithFacebook, signInWithApple, logout, resetPassword, isAdmin, permissions, canAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
