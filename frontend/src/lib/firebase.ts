import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDqpTy74A83C928f_QlRFVn4iRuZAvT4gE",
  authDomain: "devflow-ca713.firebaseapp.com",
  projectId: "devflow-ca713",
  storageBucket: "devflow-ca713.firebasestorage.app",
  messagingSenderId: "987045589738",
  appId: "1:987045589738:web:395835a35e217fd3be1d93",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
