// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "read-book-free.firebaseapp.com",
  projectId: "read-book-free",
  storageBucket: "read-book-free.appspot.com",
  messagingSenderId: "596994119262",
  appId: "1:596994119262:web:a6dca291e257597310c6cf",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getStorage(app)