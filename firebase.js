// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "nerd-nest-fd9e6.firebaseapp.com",
  projectId: "nerd-nest-fd9e6",
  storageBucket: "nerd-nest-fd9e6.firebasestorage.app",
  messagingSenderId: "215896921778",
  appId: "1:215896921778:web:b60737d6eb0dc7b6505bab"
};

// Initialize Firebase
const app = !getApps().length? initializeApp(firebaseConfig):getApp();
const auth = getAuth(app);
export { app, auth };