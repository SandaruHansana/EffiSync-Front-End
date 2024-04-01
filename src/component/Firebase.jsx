import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB-GyKXGigdBuPNH4OBdxgT-pKmyriIqfM",
    authDomain: "firestore-auth-c7d53.firebaseapp.com",
    projectId: "firestore-auth-c7d53",
    storageBucket: "firestore-auth-c7d53.appspot.com",
    messagingSenderId: "299692797424",
    appId: "1:299692797424:web:856399bcc6cb99bf16c135"
  };
  
  const app = firebase.initializeApp(firebaseConfig)
  export const db = firebase.firestore()
