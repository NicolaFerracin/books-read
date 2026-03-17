import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged as onAuth,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import type { Book, BookFormData, YearGoal } from '../types'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(config)
const auth = getAuth(app)
const db = getFirestore(app)

const BOOKS_COLLECTION = 'books'
const GOALS_COLLECTION = 'reading_goals'

const getUserId = () => auth.currentUser?.uid

// Auth
export const signIn = () => signInWithPopup(auth, new GoogleAuthProvider())
export const logout = () => signOut(auth)
export const onAuthStateChanged = (cb: (user: User | null) => void) => onAuth(auth, cb)

// Books
export const getAllBooks = async (): Promise<Book[]> => {
  const uid = getUserId()
  if (!uid) return []
  const q = query(collection(db, BOOKS_COLLECTION), where('uid', '==', uid))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as Book)
}

export const getBook = async (bookId: string): Promise<Book | null> => {
  const snap = await getDoc(doc(db, BOOKS_COLLECTION, bookId))
  if (!snap.exists()) return null
  return { ...snap.data(), id: snap.id } as Book
}

// Strip undefined values — Firestore rejects them
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T
}

export const addBook = async (book: BookFormData) => {
  const uid = getUserId()
  if (!uid) throw new Error('Not authenticated')
  return addDoc(collection(db, BOOKS_COLLECTION), { ...stripUndefined(book), uid })
}

export const editBook = async (id: string, book: Partial<BookFormData>) => {
  return updateDoc(doc(db, BOOKS_COLLECTION, id), stripUndefined(book))
}

export const deleteBook = async (id: string) => {
  return deleteDoc(doc(db, BOOKS_COLLECTION, id))
}

// Reading Goals
export const getGoals = async (): Promise<YearGoal[]> => {
  const uid = getUserId()
  if (!uid) return []
  const q = query(collection(db, GOALS_COLLECTION), where('uid', '==', uid))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as YearGoal & { id: string })
}

export const setGoal = async (year: number, target: number) => {
  const uid = getUserId()
  if (!uid) throw new Error('Not authenticated')
  const q = query(
    collection(db, GOALS_COLLECTION),
    where('uid', '==', uid),
    where('year', '==', year)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) {
    return addDoc(collection(db, GOALS_COLLECTION), { year, target, uid })
  } else {
    return updateDoc(snapshot.docs[0].ref, { target })
  }
}
