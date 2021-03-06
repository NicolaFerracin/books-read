import * as firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

firebase.initializeApp(config);

const COLLECTION = 'books';

const getUserId = () => firebase.auth().currentUser.uid;

const db = firebase.firestore();

export const logout = () =>
  firebase
    .auth()
    .signOut()
    .then(() => (window.location = '/'));

export const onAuthStateChanged = next => firebase.auth().onAuthStateChanged(next);

export const getAllBooks = () =>
  db
    .collection(COLLECTION)
    .where('uid', '==', getUserId())
    .get();

export const getBook = bookId =>
  db
    .collection(COLLECTION)
    .doc(bookId)
    .get();

export const addBook = book =>
  db.collection(COLLECTION).add({
    ...book,
    uid: getUserId()
  });

export const editBook = async (id, book) => {
  const docRef = db.collection(COLLECTION).doc(id);
  return await docRef.update(book);
};

export const deleteBook = id => {
  return db
    .collection(COLLECTION)
    .doc(id)
    .delete();
};

export default firebase;
