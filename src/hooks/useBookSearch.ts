import { useState, useRef } from 'react'
import { searchBooks } from '../lib/openLibrary'
import type { OpenLibraryResult } from '../types'

export function useBookSearch() {
  const [results, setResults] = useState<OpenLibraryResult[]>([])
  const [searching, setSearching] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const search = (query: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (query.length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    timeoutRef.current = setTimeout(async () => {
      const data = await searchBooks(query)
      setResults(data)
      setSearching(false)
    }, 400)
  }

  const clear = () => {
    setResults([])
    setSearching(false)
  }

  return { results, searching, search, clear }
}
