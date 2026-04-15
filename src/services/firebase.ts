import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbJD4fv9IW50aC_ohfPbjPkoj6ook6QcE",
  authDomain: "projeto-firebase-ee817.firebaseapp.com",
  projectId: "projeto-firebase-ee817",
  storageBucket: "projeto-firebase-ee817.firebasestorage.app",
  messagingSenderId: "824388499423",
  appId: "1:824388499423:web:7e6b1890cc5c91c395b66a"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db }