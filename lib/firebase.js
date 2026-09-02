import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuCkaUJe17b_gzsJZaSQzpK_qDyCe_9vU",
  authDomain: "soangiaoan-7b315.firebaseapp.com",
  projectId: "soangiaoan-7b315",
  storageBucket: "soangiaoan-7b315.firebasestorage.app",
  messagingSenderId: "945267023845",
  appId: "1:945267023845:web:52f58e5d87da65cffb190c",
  measurementId: "G-8QLLBWYQH4"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = typeof window !== 'undefined' ? getFirestore(app) : null;
const auth = typeof window !== 'undefined' ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();

let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { app, db, auth, googleProvider, analytics, firebaseConfig };