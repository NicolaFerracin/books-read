import type { Book } from '../types'
import StarRating from './StarRating'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const STATUS_CONFIG = {
  started: { label: 'Reading', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  finished: { label: 'Finished', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  unfinished: { label: 'Unfinished', color: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
}

interface Props {
  book: Book
  onEdit: (book: Book) => void
}

export default function BookCard({ book, onEdit }: Props) {
  const [month, year] = book.startedIn.split('-')
  const dateStr = `${MONTHS[Number(month)]} ${year}`
  const status = STATUS_CONFIG[book.status]

  return (
    <div
      onClick={() => onEdit(book)}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/20"
    >
      <div className="flex gap-4 p-4">
        {/* Cover */}
        <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-slate-800">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
              <span className="text-2xl opacity-40">📖</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight truncate group-hover:text-amber-300 transition-colors">
            {book.title}
          </h3>
          {book.author && (
            <p className="text-slate-500 text-xs mt-0.5 truncate">{book.author}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.color}`}>
              {status.label}
            </span>
            <span className="text-slate-600 text-[10px]">{dateStr}</span>
          </div>

          {book.rating ? (
            <div className="mt-2">
              <StarRating rating={book.rating} size="sm" />
            </div>
          ) : null}
        </div>
      </div>

    </div>
  )
}
