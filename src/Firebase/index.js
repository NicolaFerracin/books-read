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

const db = firebase.firestore();

export const onAuthStateChanged = next => firebase.auth().onAuthStateChanged(next);

export const getAllBooks = () => db.collection('books').get();

export const addDoc = (doc, collection) => db.collection(collection).add(doc);

export const updateDoc = (id, doc, collection) => {
  const docRef = db.collection(collection).doc(id);
  return docRef.update(doc);
};

export const deleteDoc = (id, collection) => {
  return db
    .collection(collection)
    .doc(id)
    .delete();
};

export default firebase;
