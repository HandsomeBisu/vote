import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbL9Dm3_dJFySXAC3rwgDh6Vpos-7-x30",
  authDomain: "dpsteam.firebaseapp.com",
  projectId: "dpsteam",
  storageBucket: "dpsteam.firebasestorage.app",
  messagingSenderId: "681061854285",
  appId: "1:681061854285:web:d1a770ba597fcb785b4004",
  measurementId: "G-93XNC4MZYV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);