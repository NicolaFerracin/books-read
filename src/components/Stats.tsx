import type { Book } from '../types'

interface Props {
  books: Book[]
  selectedYear: string
}

export default function Stats({ books, selectedYear }: Props) {
  const finished = books.filter((b) => b.status === 'finished')
  const reading = books.filter((b) => b.status === 'started')
  const totalPages = finished.reduce((sum, b) => sum + (b.pages || 0), 0)

  const now = new Date()
  const currentYear = now.getFullYear()
  let daysElapsed: number

  if (selectedYear === 'all') {
    const years = books.map((b) => Number(b.startedIn.split('-')[1]))
    const firstYear = Math.min(...years, currentYear)
    daysElapsed = Math.max(1, Math.floor((now.getTime() - new Date(firstYear, 0, 1).getTime()) / 86400000))
  } else {
    const year = Number(selectedYear)
    if (year === currentYear) {
      daysElapsed = Math.max(1, Math.floor((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000))
    } else {
      daysElapsed = 365
    }
  }

  const pagesPerDay = totalPages > 0 ? Math.round(totalPages / daysElapsed) : 0

  const stats = [
    { label: 'Finished', value: finished.length, icon: '✓' },
    { label: 'Reading', value: reading.length, icon: '📖' },
    { label: 'Pages', value: totalPages.toLocaleString(), icon: '📄' },
    { label: 'Pages/day', value: pagesPerDay, icon: '⚡' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
