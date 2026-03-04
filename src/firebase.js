import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAm_KzqrOyCMffmiba30MGiIldrNJ6Ag3s",
  authDomain: "sendmoji.firebaseapp.com",
  databaseURL: "https://sendmoji-default-rtdb.firebaseio.com/",
  projectId: "sendmoji",
  storageBucket: "sendmoji.firebasestorage.app",
  messagingSenderId: "471881894540",
  appId: "1:471881894540:web:e39ea8f81a1f3bcb1a89a9"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)