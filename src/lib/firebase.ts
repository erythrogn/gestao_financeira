import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsLi3b3kJo5HSiwpFKxnWHCarkZh8o-AU",
  authDomain: "saasgestao-2bf79.firebaseapp.com",
  projectId: "saasgestao-2bf79",
  storageBucket: "saasgestao-2bf79.firebasestorage.app",
  messagingSenderId: "13455334563",
  appId: "1:13455334563:web:52dba24831c11eebe8b316"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
