import { useState, useMemo } from 'react'
import type { Book } from '../types'
import Stats from './Stats'
import CurrentlyReading from './CurrentlyReading'
import BookCard from './BookCard'
import SearchFilter from './SearchFilter'

interface Props {
  books: Book[]
  allBooks: Book[]
  currentlyReading: Book[]
  selectedYear: string
  loading: boolean
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export default function Dashboard({ books, allBooks, currentlyReading, selectedYear, loading, onEdit, onDelete, onAdd }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')

  const filteredBooks = useMemo(() => {
    let result = [...books]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter)
    }

    switch (sortBy) {
      case 'date-asc':
        result.reverse()
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'pages-desc':
        result.sort((a, b) => (b.pages || 0) - (a.pages || 0))
        break
    }

    return result
  }, [books, search, statusFilter, sortBy])

  if (loading) {
    return (
      <div className="p-6 lg:p-10 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-shimmer rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 animate-shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (allBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-semibold text-white mb-2">No books yet</h2>
        <p className="text-slate-500 mb-6 max-w-sm">
          Start tracking your reading journey by adding your first book.
        </p>
        <button
          onClick={onAdd}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-colors"
        >
          Add your first book
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 space-y-6 pb-24">
      {/* Header */}
      <div className="hidden lg:block">
        <h2 className="font-serif text-3xl font-bold text-white">
          {selectedYear === 'all' ? 'All Books' : selectedYear}
        </h2>
      </div>

      {/* Stats */}
      <Stats books={books} selectedYear={selectedYear} />

      {/* Currently Reading (only on "all" or current year) */}
      {selectedYear === 'all' && currentlyReading.length > 0 && (
        <CurrentlyReading
          books={currentlyReading}
          onEdit={onEdit}
        />
      )}

      {/* Search & Filter */}
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 text-slate-600">
          No books match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
