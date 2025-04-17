// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getAuth } from 'firebase/auth';
import { IndexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCav4vc6J0_2j57Jp85sx-2A5BQiX1B3ws",
  authDomain: "project-coach-79581.firebaseapp.com",
  projectId: "project-coach-79581",
  storageBucket: "project-coach-79581.firebasestorage.app",
  messagingSenderId: "598471846245",
  appId: "1:598471846245:web:ffe186778b70aabbe3198c",
  measurementId: "G-PLDGWVN329"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// For React Native, we can use getAuth() without persistence temporarily
export const auth = getAuth(app);

// If you need persistence, you'll need to install the correct package
// and set it up according to your Firebase version
export const db = getFirestore(app);
const analytics = getAnalytics(app);