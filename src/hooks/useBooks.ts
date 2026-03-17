import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllBooks, addBook, editBook, deleteBook } from '../lib/firebase'
import { backfillCovers } from '../lib/backfillCovers'
import type { Book, BookFormData } from '../types'

function sortByDate(a: Book, b: Book): number {
  const [monthA, yearA] = a.startedIn.split('-').map(Number)
  const [monthB, yearB] = b.startedIn.split('-').map(Number)
  return new Date(yearB, monthB).getTime() - new Date(yearA, monthA).getTime()
}

export function useBooks(isLoggedIn: boolean) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const backfillRan = useRef(false)

  const refresh = useCallback(async () => {
    if (!isLoggedIn) return
    setLoading(true)
    const data = await getAllBooks()
    setBooks(data.sort(sortByDate))
    setLoading(false)
    return data
  }, [isLoggedIn])

  useEffect(() => {
    refresh().then((data) => {
      if (data && data.length > 0 && !backfillRan.current) {
        backfillRan.current = true
        backfillCovers(data, () => refresh())
      }
    })
  }, [refresh])

  const booksPerYear = books.reduce<Record<string, Book[]>>((acc, book) => {
    const year = book.startedIn.split('-')[1]
    if (!acc[year]) acc[year] = []
    acc[year].push(book)
    return acc
  }, {})

  const years = Object.keys(booksPerYear)
    .map(Number)
    .sort((a, b) => b - a)

  const currentlyReading = books.filter((b) => b.status === 'started')

  const add = async (data: BookFormData) => {
    await addBook(data)
    await refresh()
  }

  const update = async (id: string, data: Partial<BookFormData>) => {
    await editBook(id, data)
    await refresh()
  }

  const remove = async (id: string) => {
    await deleteBook(id)
    await refresh()
  }

  return { books, booksPerYear, years, currentlyReading, loading, add, update, remove, refresh }
}
