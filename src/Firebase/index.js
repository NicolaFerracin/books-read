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
const db = firebase.firestore();

export const onAuthStateChanged = next => firebase.auth().onAuthStateChanged(next);

export const getAllBooks = () => db.collection(COLLECTION).get();

export const addBook = book => db.collection(COLLECTION).add(book);

export const updateDoc = (id, doc) => {
  const docRef = db.collection(COLLECTION).doc(id);
  return docRef.update(doc);
};

export const deleteDoc = id => {
  return db
    .collection(COLLECTION)
    .doc(id)
    .delete();
};

export default firebase;
