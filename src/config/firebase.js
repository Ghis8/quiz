// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBYj1hzJ8yIM1y-uLF_fLdOCvViUxhn1Ws",
  authDomain: "quiz-app-d1053.firebaseapp.com",
  projectId: "quiz-app-d1053",
  storageBucket: "quiz-app-d1053.appspot.com",
  messagingSenderId: "360146669282",
  appId: "1:360146669282:web:199ef6a9534ae817c058bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db=getFirestore(app)