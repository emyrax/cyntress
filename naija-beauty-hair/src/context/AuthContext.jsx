import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getDocument } from '../firebase/firestore'

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

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const register = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, 'admins', cred.user.uid), { role: 'admin', email, createdAt: new Date() })
  }

  const logout = () => signOut(auth)

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email)

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'editor'

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, register, logout, resetPassword, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
