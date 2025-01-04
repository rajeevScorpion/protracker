import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChHV3rghFDt43ANnLFLwVd9VsM6MG7zq4",
  authDomain: "professional-activity-trackin.firebaseapp.com",
  projectId: "professional-activity-trackin",
  storageBucket: "professional-activity-trackin.firebasestorage.app",
  messagingSenderId: "149179562377",
  appId: "1:149179562377:web:a624092927e93be71d8958",
  measurementId: "G-2Y2ZTZME5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
