import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyApyNj4lm2i0gXVrQ3S9G-jMwTdjG9o7GU",
  authDomain: "tindahan-inventory.firebaseapp.com",
  projectId: "tindahan-inventory",
  storageBucket: "tindahan-inventory.firebasestorage.app",
  messagingSenderId: "128402097823",
  appId: "1:128402097823:web:714de3b6e027f24a5b44aa",
  measurementId: "G-PMMEBG3SQF"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

export default app
