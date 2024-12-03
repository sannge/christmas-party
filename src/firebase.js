// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZS0SxYmSN7WejRo6fsSbWb-iM4J8aKLA",
  authDomain: "christmas-party-ba9a1.firebaseapp.com",
  projectId: "christmas-party-ba9a1",
  storageBucket: "christmas-party-ba9a1.firebasestorage.app",
  messagingSenderId: "51882863991",
  appId: "1:51882863991:web:81a4990d653207e4f94572",
  measurementId: "G-CH9V2WMCLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };