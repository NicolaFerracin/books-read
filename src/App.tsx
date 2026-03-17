import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useBooks } from './hooks/useBooks'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import BookFormModal from './components/BookFormModal'
import type { Book } from './types'

export default function App() {
  const { user, loading: authLoading, isLoggedIn } = useAuth()
  const { books, booksPerYear, years, currentlyReading, loading: booksLoading, add, update, remove } = useBooks(isLoggedIn)
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [rereadBook, setRereadBook] = useState<Book | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 text-lg">Loading...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Login />
  }

  const displayBooks = selectedYear === 'all' ? books : (booksPerYear[selectedYear] || [])

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setShowForm(true)
  }

  const handleReread = (book: Book) => {
    setRereadBook(book)
    setEditingBook(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingBook(null)
    setRereadBook(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar
        years={years}
        booksPerYear={booksPerYear}
        selectedYear={selectedYear}
        onSelectYear={(y) => { setSelectedYear(y); setSidebarOpen(false) }}
        userName={user?.displayName || ''}
        userPhoto={user?.photoURL || ''}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-h-screen lg:ml-72">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-serif text-xl font-bold">Books</h1>
          <div className="w-6" />
        </div>

        <Dashboard
          books={displayBooks}
          allBooks={books}
          currentlyReading={currentlyReading}
          selectedYear={selectedYear}
          loading={booksLoading}
          onEdit={handleEdit}
          onDelete={remove}
          onUpdateProgress={(id, page) => update(id, { currentPage: page })}
          onAdd={() => setShowForm(true)}
        />
      </main>

      {showForm && (
        <BookFormModal
          book={editingBook}
          onSave={async (data) => {
            if (editingBook) {
              await update(editingBook.id, data)
            } else {
              await add(data)
            }
            handleCloseForm()
          }}
          onClose={handleCloseForm}
          onDelete={editingBook ? async () => {
            await remove(editingBook.id)
            handleCloseForm()
          } : undefined}
        />
      )}

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg shadow-amber-500/25 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
