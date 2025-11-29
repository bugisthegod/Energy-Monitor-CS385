// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnUCIlO7CbfJZVbAK54fKJtvwG6QmA4ZU",
  authDomain: "energy-monitor-cs385.firebaseapp.com",
  projectId: "energy-monitor-cs385",
  storageBucket: "energy-monitor-cs385.firebasestorage.app",
  messagingSenderId: "402220424877",
  appId: "1:402220424877:web:20e19b7e05c9b92edef024",
  measurementId: "G-PT4Q68V1JM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Export auth to use in your components
const analytics = getAnalytics(app);

export default app;