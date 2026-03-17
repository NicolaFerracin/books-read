export interface Book {
  id: string
  title: string
  author: string
  startedIn: string // "MM-YYYY"
  finishedIn?: string // "MM-YYYY"
  pages: number
  currentPage?: number
  status: 'started' | 'finished' | 'unfinished'
  rating?: number // 1-5
  notes?: string
  coverUrl?: string
  isbn?: string
  uid: string
}

export type BookFormData = Omit<Book, 'id' | 'uid'>

export interface YearGoal {
  year: number
  target: number
}

export interface OpenLibraryResult {
  title: string
  author: string
  coverUrl?: string
  isbn?: string
  pages?: number
  firstPublishYear?: number
}
