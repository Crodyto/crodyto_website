// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// তোর আসল Firebase Config এখানে বসাবি
const firebaseConfig = {
  apiKey: "AIzaSyDmCjNXRF9aTsiZx-ZX-qYnDfHZHSmeiaA",
  authDomain: "crodyto-bac3b.firebaseapp.com",
  projectId: "crodyto-bac3b",
  storageBucket: "crodyto-bac3b.firebasestorage.app",
  messagingSenderId: "684772541925",
  appId: "1:684772541925:web:1df1662f63a89478619b0c",
  measurementId: "G-0SXNN0D4V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();





