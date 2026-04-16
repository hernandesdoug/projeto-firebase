import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: "projeto-firebase-ee817.firebaseapp.com",
  projectId: "projeto-firebase-ee817",
  storageBucket: "projeto-firebase-ee817.firebasestorage.app",
  messagingSenderId: "824388499423",
  appId: import.meta.env.VITE_APPID
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }