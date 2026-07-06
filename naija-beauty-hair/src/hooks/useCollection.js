import { useState, useEffect, useCallback } from 'react'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useCollection(collectionName, constraints = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const q = query(
      collection(db, collectionName),
      orderBy('createdAt', 'desc'),
      ...constraints
    )

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setData(docs)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [collectionName])

  return { data, loading, error }
}
