import { useState, useEffect } from 'react'
import { type User } from 'firebase/auth'
import { onAuthStateChanged } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, loading, isLoggedIn: !!user }
}
