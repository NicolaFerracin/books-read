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

export async function lookupByIsbn(isbn: string): Promise<OpenLibraryResult | null> {
  const clean = isbn.replace(/[-\s]/g, '')
  if (!/^\d{10}(\d{3})?$/.test(clean)) return null

  try {
    const res = await fetch(`https://openlibrary.org/isbn/${clean}.json`)
    if (!res.ok) return null
    const data = await res.json()

    // Fetch author name separately (the ISBN endpoint gives author keys, not names)
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
    return {
      title: data.title || '',
      author,
      coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined,
      isbn: clean,
      pages: data.number_of_pages || undefined,
      firstPublishYear: data.publish_date ? parseInt(data.publish_date) || undefined : undefined,
    }
  } catch {
    return null
  }
}
