import { useMemo } from 'react'
import type { Book } from '../types'

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface Props {
  books: Book[]
  selectedYear: string
}

interface DataPoint {
  label: string
  books: number
  pages: number
}

function buildYearlyData(books: Book[]): DataPoint[] {
  const finished = books.filter((b) => b.status === 'finished')
  const byYear: Record<string, { books: number; pages: number }> = {}

  for (const book of finished) {
    const year = book.startedIn.split('-')[1]
    if (!byYear[year]) byYear[year] = { books: 0, pages: 0 }
    byYear[year].books++
    byYear[year].pages += book.pages || 0
  }

  return Object.keys(byYear)
    .sort()
    .map((year) => ({ label: year, ...byYear[year] }))
}

function buildMonthlyData(books: Book[], year: string): DataPoint[] {
  const finished = books.filter((b) => b.status === 'finished')
  const byMonth: Record<number, { books: number; pages: number }> = {}

  for (let i = 0; i < 12; i++) byMonth[i] = { books: 0, pages: 0 }

  for (const book of finished) {
    const [month, y] = book.startedIn.split('-')
    if (y === year) {
      byMonth[Number(month)].books++
      byMonth[Number(month)].pages += book.pages || 0
    }
  }

  return Array.from({ length: 12 }, (_, i) => ({
    label: MONTHS_SHORT[i],
    ...byMonth[i],
  }))
}

function BarChart({ data, valueKey, color, gradientId }: {
  data: DataPoint[]
  valueKey: 'books' | 'pages'
  color: string
  gradientId: string
}) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1)
  const barWidth = Math.max(8, Math.min(40, Math.floor(600 / data.length) - 8))

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${data.length * (barWidth + 8) + 40} 160`}
        className="w-full min-w-[300px]"
        style={{ maxHeight: 160 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const value = d[valueKey]
          const barHeight = max > 0 ? (value / max) * 110 : 0
          const x = i * (barWidth + 8) + 20
          const y = 125 - barHeight
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={`url(#${gradientId})`}
                className="transition-all duration-500"
              />
              {value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  className="fill-slate-400 text-[9px]"
                >
                  {valueKey === 'pages' ? (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value) : value}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={145}
                textAnchor="middle"
                className="fill-slate-600 text-[9px]"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function Charts({ books, selectedYear }: Props) {
  const data = useMemo(
    () => selectedYear === 'all' ? buildYearlyData(books) : buildMonthlyData(books, selectedYear),
    [books, selectedYear]
  )

  const hasData = data.some((d) => d.books > 0)
  if (!hasData) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-medium text-slate-500 mb-3">
          Books finished {selectedYear === 'all' ? 'per year' : 'per month'}
        </h3>
        <BarChart data={data} valueKey="books" color="#f59e0b" gradientId="booksGrad" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-medium text-slate-500 mb-3">
          Pages read {selectedYear === 'all' ? 'per year' : 'per month'}
        </h3>
        <BarChart data={data} valueKey="pages" color="#3b82f6" gradientId="pagesGrad" />
      </div>
    </div>
  )
}
