import type { Book } from '../types'

interface Props {
  books: Book[]
  onEdit: (book: Book) => void
}

export default function CurrentlyReading({ books, onEdit }: Props) {
  if (books.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        Currently Reading
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {books.map((book) => {
          const progress = book.currentPage && book.pages
            ? Math.min(Math.round((book.currentPage / book.pages) * 100), 100)
            : 0

          return (
            <div
              key={book.id}
              onClick={() => onEdit(book)}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-4 cursor-pointer hover:border-slate-600 transition-all group"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-slate-700">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                      <span className="text-xl opacity-40">📖</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm leading-tight truncate group-hover:text-amber-300 transition-colors">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-slate-500 text-xs mt-0.5 truncate">{book.author}</p>
                  )}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>{book.currentPage || 0} / {book.pages} pages</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-grow"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
