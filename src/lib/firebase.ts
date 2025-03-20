import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChHV3rghFDt43ANnLFLwVd9VsM6MG7zq4",
  authDomain: "professional-activity-trackin.firebaseapp.com",
  projectId: "professional-activity-trackin",
  storageBucket: "professional-activity-trackin.appspot.com",
  messagingSenderId: "149179562377",
  appId: "1:149179562377:web:a624092927e93be71d8958",
  measurementId: "G-2Y2ZTZME5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Debug log
auth.onAuthStateChanged((user) => {
  console.log('Firebase Auth State Changed:', user ? 'User is signed in' : 'No user');
});

export default app;
