import { useState, useEffect, useRef } from 'react'
import { useBookSearch } from '../hooks/useBookSearch'
import { lookupByIsbn } from '../lib/openLibrary'
import StarRating from './StarRating'
import type { Book, BookFormData, OpenLibraryResult } from '../types'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const STATUSES = [
  { value: 'started', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
  { value: 'unfinished', label: 'Unfinished' },
] as const

interface Props {
  book: Book | null
  onSave: (data: BookFormData) => Promise<void>
  onClose: () => void
  onDelete?: () => Promise<void>
}

export default function BookFormModal({ book, onSave, onClose, onDelete }: Props) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const [title, setTitle] = useState(book?.title || '')
  const [author, setAuthor] = useState(book?.author || '')
  const [pages, setPages] = useState(book?.pages?.toString() || '')
  const [currentPage, setCurrentPage] = useState(book?.currentPage?.toString() || '')
  const [status, setStatus] = useState<Book['status']>(book?.status || 'started')
  const [startMonth, setStartMonth] = useState(() => {
    if (book?.startedIn) return Number(book.startedIn.split('-')[0])
    return currentMonth
  })
  const [startYear, setStartYear] = useState(() => {
    if (book?.startedIn) return Number(book.startedIn.split('-')[1])
    return currentYear
  })
  const [finishMonth, setFinishMonth] = useState(() => {
    if (book?.finishedIn) return Number(book.finishedIn.split('-')[0])
    return currentMonth
  })
  const [finishYear, setFinishYear] = useState(() => {
    if (book?.finishedIn) return Number(book.finishedIn.split('-')[1])
    return currentYear
  })
  const [rating, setRating] = useState(book?.rating || 0)
  const [notes, setNotes] = useState(book?.notes || '')
  const [coverUrl, setCoverUrl] = useState(book?.coverUrl || '')
  const [isbn, setIsbn] = useState(book?.isbn || '')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { results, searching, search, clear } = useBookSearch()
  const [showResults, setShowResults] = useState(false)
  const [isbnLooking, setIsbnLooking] = useState(false)
  const isbnTimeout = useRef<ReturnType<typeof setTimeout>>()

  // Generate year options
  const years: number[] = []
  for (let y = currentYear; y >= 1990; y--) years.push(y)

  useEffect(() => {
    if (!book && title.length >= 2) {
      search(title)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [title, book])

  const handleIsbnChange = (value: string) => {
    setIsbn(value)
    if (isbnTimeout.current) clearTimeout(isbnTimeout.current)
    const clean = value.replace(/[-\s]/g, '')
    if (/^\d{10}(\d{3})?$/.test(clean)) {
      setIsbnLooking(true)
      isbnTimeout.current = setTimeout(async () => {
        const result = await lookupByIsbn(clean)
        if (result) {
          setTitle(result.title)
          setAuthor(result.author)
          if (result.pages) setPages(String(result.pages))
          if (result.coverUrl) setCoverUrl(result.coverUrl)
        }
        setIsbnLooking(false)
      }, 300)
    }
  }

  const selectResult = (result: OpenLibraryResult) => {
    setTitle(result.title)
    setAuthor(result.author)
    if (result.pages) setPages(String(result.pages))
    if (result.coverUrl) setCoverUrl(result.coverUrl)
    if (result.isbn) setIsbn(result.isbn)
    clear()
    setShowResults(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !pages) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      author: author.trim(),
      pages: Number(pages),
      currentPage: currentPage ? Number(currentPage) : undefined,
      status,
      startedIn: `${startMonth}-${startYear}`,
      finishedIn: status === 'finished' ? `${finishMonth}-${finishYear}` : undefined,
      rating: rating || undefined,
      notes: notes.trim() || undefined,
      coverUrl: coverUrl || undefined,
      isbn: isbn || undefined,
    })
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    if (onDelete) {
      setSaving(true)
      await onDelete()
    }
  }

  const inputCls = 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50'
  const labelCls = 'block text-xs font-medium text-slate-400 mb-1.5'
  const selectCls = 'px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer'

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 pt-[10vh] overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">
            {book ? 'Edit Book' : 'Add Book'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Cover preview */}
          {coverUrl && (
            <div className="flex justify-center">
              <img src={coverUrl} alt="" className="h-32 rounded-lg shadow-lg" />
            </div>
          )}

          {/* ISBN lookup */}
          <div className="relative">
            <label className={labelCls}>ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => handleIsbnChange(e.target.value)}
              className={inputCls}
              placeholder="Paste ISBN to auto-fill everything..."
            />
            {isbnLooking && (
              <div className="absolute right-3 top-8">
                <div className="w-4 h-4 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">or search by title</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Title with search */}
          <div className="relative">
            <label className={labelCls}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="Search or enter book title..."
              required
              autoFocus
            />
            {searching && (
              <div className="absolute right-3 top-8">
                <div className="w-4 h-4 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
              </div>
            )}
            {showResults && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                {results.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectResult(r)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition-colors text-left border-b border-slate-700/50 last:border-0"
                  >
                    {r.coverUrl ? (
                      <img src={r.coverUrl} alt="" className="w-8 h-12 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-12 rounded bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs opacity-40">📖</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{r.title}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {r.author}{r.firstPublishYear ? ` (${r.firstPublishYear})` : ''}
                        {r.pages ? ` · ${r.pages}p` : ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <label className={labelCls}>Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={inputCls}
              placeholder="Author name"
            />
          </div>

          {/* Pages + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Pages *</label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className={inputCls}
                placeholder="300"
                min={1}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Book['status'])}
                className={`w-full ${selectCls}`}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current page (only for started) */}
          {status === 'started' && (
            <div>
              <label className={labelCls}>Current Page</label>
              <input
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className={inputCls}
                placeholder="0"
                min={0}
                max={Number(pages) || undefined}
              />
            </div>
          )}

          {/* Started in */}
          <div>
            <label className={labelCls}>Started in</label>
            <div className="grid grid-cols-2 gap-3">
              <select value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))} className={selectCls}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select value={startYear} onChange={(e) => setStartYear(Number(e.target.value))} className={selectCls}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Finished in (only for finished) */}
          {status === 'finished' && (
            <div>
              <label className={labelCls}>Finished in</label>
              <div className="grid grid-cols-2 gap-3">
                <select value={finishMonth} onChange={(e) => setFinishMonth(Number(e.target.value))} className={selectCls}>
                  {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select value={finishYear} onChange={(e) => setFinishYear(Number(e.target.value))} className={selectCls}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Rating (for finished books) */}
          {status === 'finished' && (
            <div>
              <label className={labelCls}>Rating</label>
              <StarRating rating={rating} onChange={setRating} />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Your thoughts about this book..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  confirmDelete
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-slate-500 hover:text-red-400'
                }`}
              >
                {confirmDelete ? 'Confirm delete' : 'Delete'}
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim() || !pages}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-xl text-sm transition-colors"
            >
              {saving ? 'Saving...' : book ? 'Save' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
