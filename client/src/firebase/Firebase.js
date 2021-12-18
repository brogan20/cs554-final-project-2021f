import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZXWqGxxbTnUywRN9AIZzsakHk2ofSA94",
  authDomain: "cs554final-2a3dc.firebaseapp.com",
  projectId: "cs554final-2a3dc",
  storageBucket: "cs554final-2a3dc.appspot.com",
  messagingSenderId: "554922946677",
  appId: "1:554922946677:web:e08392a75f9d0a9064c83c",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
