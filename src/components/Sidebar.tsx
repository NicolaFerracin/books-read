import { logout } from '../lib/firebase'
import type { Book } from '../types'

interface Props {
  years: number[]
  booksPerYear: Record<string, Book[]>
  selectedYear: string
  onSelectYear: (year: string) => void
  userName: string
  userPhoto: string
  open: boolean
  onClose: () => void
}

export default function Sidebar({ years, booksPerYear, selectedYear, onSelectYear, userName, userPhoto, open, onClose }: Props) {
  const totalBooks = Object.values(booksPerYear).flat().length

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-serif text-2xl font-bold text-white mb-1">Books</h1>
          <p className="text-sm text-slate-500">{totalBooks} books tracked</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button
            onClick={() => onSelectYear('all')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectedYear === 'all'
                ? 'bg-amber-500/15 text-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Books
          </button>

          <div className="pt-4 pb-2 px-4">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">By Year</span>
          </div>

          {years.map((year) => {
            const count = booksPerYear[String(year)]?.length || 0
            const finished = booksPerYear[String(year)]?.filter(b => b.status === 'finished').length || 0
            return (
              <button
                key={year}
                onClick={() => onSelectYear(String(year))}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  selectedYear === String(year)
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{year}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedYear === String(year)
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {finished}/{count}
                </span>
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            {userPhoto ? (
              <img src={userPhoto} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">
                {userName?.[0] || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 truncate">{userName}</p>
            </div>
            <button
              onClick={() => logout()}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
