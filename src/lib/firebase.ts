import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChHV3rghFDt43ANnLFLwVd9VsM6MG7zq4",
  authDomain: "professional-activity-trackin.firebaseapp.com",
  projectId: "professional-activity-trackin",
  storageBucket: "professional-activity-trackin.firebasestorage.app",
  messagingSenderId: "149179562377",
  appId: "1:149179562377:web:a624092927e93be71d8958",
  measurementId: "G-2Y2ZTZME5H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;
