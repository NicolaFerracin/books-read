interface Props {
  search: string
  onSearchChange: (val: string) => void
  statusFilter: string
  onStatusFilterChange: (val: string) => void
  sortBy: string
  onSortChange: (val: string) => void
}

export default function SearchFilter({ search, onSearchChange, statusFilter, onStatusFilterChange, sortBy, onSortChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700"
        />
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-slate-700 cursor-pointer"
      >
        <option value="all">All statuses</option>
        <option value="started">Reading</option>
        <option value="finished">Finished</option>
        <option value="unfinished">Unfinished</option>
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-slate-700 cursor-pointer"
      >
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="title">Title A-Z</option>
        <option value="rating">Highest rated</option>
        <option value="pages-desc">Most pages</option>
      </select>
    </div>
  )
}
