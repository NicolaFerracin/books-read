import type { OpenLibraryResult } from '../types'

export async function searchBooks(queryStr: string): Promise<OpenLibraryResult[]> {
  if (!queryStr || queryStr.length < 2) return []

  const encoded = encodeURIComponent(queryStr)
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encoded}&limit=8&fields=title,author_name,cover_i,isbn,number_of_pages_median,first_publish_year`
  )
  const data = await res.json()

  return (data.docs || []).map((doc: Record<string, unknown>) => ({
    title: (doc.title as string) || '',
    author: ((doc.author_name as string[]) || [])[0] || '',
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : undefined,
    isbn: ((doc.isbn as string[]) || [])[0],
    pages: (doc.number_of_pages_median as number) || undefined,
    firstPublishYear: (doc.first_publish_year as number) || undefined,
  }))
}

async function googleBooksLookup(isbn: string): Promise<OpenLibraryResult | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    if (!res.ok) return null
    const data = await res.json()
    const vol = data.items?.[0]?.volumeInfo
    if (!vol) return null
    return {
      title: vol.title || '',
      author: vol.authors?.[0] || '',
      coverUrl: vol.imageLinks?.thumbnail?.replace('http://', 'https://') || undefined,
      isbn,
      pages: vol.pageCount || undefined,
      firstPublishYear: vol.publishedDate ? parseInt(vol.publishedDate) || undefined : undefined,
    }
  } catch {
    return null
  }
}

export async function lookupByIsbn(isbn: string): Promise<OpenLibraryResult | null> {
  const clean = isbn.replace(/[-\s]/g, '')
  if (!/^\d{10}(\d{3})?$/.test(clean)) return null

  // Try Open Library first
  try {
    const res = await fetch(`https://openlibrary.org/isbn/${clean}.json`)
    if (res.ok) {
      const data = await res.json()

      let author = ''
      const authorKey = data.authors?.[0]?.key
      if (authorKey) {
        try {
          const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`)
          const authorData = await authorRes.json()
          author = authorData.name || ''
        } catch {}
      }

      const coverId = data.covers?.[0]
      const result: OpenLibraryResult = {
        title: data.title || '',
        author,
        coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined,
        isbn: clean,
        pages: data.number_of_pages || undefined,
        firstPublishYear: data.publish_date ? parseInt(data.publish_date) || undefined : undefined,
      }

      // If Open Library has no cover, try Google Books for the cover
      if (!result.coverUrl) {
        const gResult = await googleBooksLookup(clean)
        if (gResult?.coverUrl) result.coverUrl = gResult.coverUrl
      }

      return result
    }
  } catch {}

  // Fallback to Google Books entirely
  return googleBooksLookup(clean)
}
