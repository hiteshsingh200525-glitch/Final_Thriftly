import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// https://firebase.google.com/docs/web/setup#available-libraries

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDRAjODFzLheqRhZz8ldREgXm7rsc_e34s",
  authDomain: "thriftly-shoes.firebaseapp.com",
  projectId: "thriftly-shoes",
  storageBucket: "thriftly-shoes.firebasestorage.app",
  messagingSenderId: "354604727974",
  appId: "1:354604727974:web:8a7031976f8182320fbe67",
  measurementId: "G-86RTWMEPNL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

