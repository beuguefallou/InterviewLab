import {initializeApp, getApp, getApps } from "firebase/app"
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { 
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "lakshya-7201a.firebaseapp.com",
  projectId: "lakshya-7201a",
  storageBucket: "lakshya-7201a.firebasestorage.app",
  messagingSenderId: "1046398316351",
  appId: "1:1046398316351:web:2dc5bb0e6b54d4c87f6d8a",
  measurementId: "G-Z4NSCXM3HD"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)
export const db = getFirestore(app)