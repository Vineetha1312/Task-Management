import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcarlXukkiXf8_Z8r8v1uGpLFkg-f4RXQ",
  authDomain: "taskmanagement-12427.firebaseapp.com",
  projectId: "taskmanagement-12427",
  storageBucket: "taskmanagement-12427.firebasestorage.app",
  messagingSenderId: "330425040451",
  appId: "1:330425040451:web:9cf152e78b7cc2b67edef6",
  measurementId: "G-YNR63CL52V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export {auth, provider}