import type { Book } from '../types'
import { editBook } from './firebase'

const BATCH_SIZE = 3
const DELAY_MS = 500

async function fetchCoverOpenLibrary(book: Book): Promise<string | null> {
  const q = encodeURIComponent(`${book.title} ${book.author || ''}`.trim())
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${q}&limit=1&fields=cover_i,isbn`
    )
    const data = await res.json()
    const doc = data.docs?.[0]
    if (doc?.cover_i) {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
    }
    if (doc?.isbn?.[0]) {
      return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`
    }
    return null
  } catch {
    return null
  }
}

async function fetchCoverGoogleBooks(book: Book): Promise<string | null> {
  const q = encodeURIComponent(`${book.title} ${book.author || ''}`.trim())
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`)
    if (!res.ok) return null
    const data = await res.json()
    const thumb = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail
    return thumb ? thumb.replace('http://', 'https://') : null
  } catch {
    return null
  }
}

async function fetchCover(book: Book): Promise<string | null> {
  return await fetchCoverOpenLibrary(book) || await fetchCoverGoogleBooks(book)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * For all books missing a coverUrl, look up Open Library and persist the cover.
 * Calls onUpdate after each batch so the UI refreshes progressively.
 */
export async function backfillCovers(
  books: Book[],
  onUpdate: () => void
): Promise<void> {
  const missing = books.filter((b) => !b.coverUrl)
  if (missing.length === 0) return

  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE)
    const results = await Promise.all(
      batch.map(async (book) => {
        const coverUrl = await fetchCover(book)
        return { book, coverUrl }
      })
    )

    let updated = false
    for (const { book, coverUrl } of results) {
      if (coverUrl) {
        await editBook(book.id, { coverUrl })
        updated = true
      }
    }

    if (updated) onUpdate()
    if (i + BATCH_SIZE < missing.length) await sleep(DELAY_MS)
  }
}
